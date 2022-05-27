import { useCallback, useEffect, useMemo } from 'react'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import debounce from 'lodash/debounce'

import { PoolCreated, PoolCreated_Filter, PoolStatus } from '@/graphql-schema'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/common/Dropdown'
import { SafeSuspense, genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { List } from '@/src/components/pools/list/List'
import { ButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { ChainsValues, getChainsByEnvironmentArray } from '@/src/constants/chains'
import { DEBOUNCED_INPUT_TIME, ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolsFilters from '@/src/hooks/aelin/useAelinPoolsFilters'
import useAelinUser from '@/src/hooks/aelin/useAelinUser'
import { useLayoutStatus } from '@/src/providers/layoutStatusProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  --gap: 20px;

  display: grid;
  gap: var(--gap);
  margin-bottom: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    grid-template-columns: 1fr 1fr;
  }
`

const DropdownItemsCSS = css`
  .dropdownItems {
    min-width: 0;
    max-width: 100%;
  }
`

const SearchWrapper = styled.div`
  position: relative;
  z-index: 10;

  ${DropdownItemsCSS}

  .dropdownItems {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`

const Search = styled(BaseSearch)`
  padding-right: 125px;
  position: relative;
  width: 100%;
  z-index: 1;
`

const SearchDropdown = styled(Dropdown)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
`

const SearchDropdownButton = styled(ButtonDropdown)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  &,
  .isOpen & {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`

const FiltersDropdowns = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  position: relative;
  z-index: 5;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    gap: var(--gap);
  }

  ${DropdownItemsCSS}
`

type SearchOptionsType = {
  label: string
  filter: keyof PoolCreated_Filter
  length: number
}

const searchOptions: Array<SearchOptionsType> = [
  {
    label: 'Pool name',
    filter: 'name_contains_nocase',
    length: 3,
  },
  {
    label: 'Sponsor',
    filter: 'sponsor_contains',
    length: 3,
  },
  {
    label: 'Currency',
    filter: 'purchaseTokenSymbol_contains_nocase',
    length: 2,
  },
]

const myPools = ['All pools', 'Sponsored', 'Funded', 'Invested']

export const ListWithFilters = ({ userPoolsInvested }: { userPoolsInvested?: PoolCreated[] }) => {
  const { address, isWalletConnected } = useWeb3Connection()

  const { network, setNetwork, setOrderBy, setOrderDirection, setWhere, variables } =
    useAelinPoolsFilters()

  const [searchFilter, setSearchFilter] = useState<SearchOptionsType>({
    filter: searchOptions[0].filter,
    label: searchOptions[0].label,
    length: searchOptions[0].length,
  })

  const [searchString, setSearchString] = useState('')
  const [poolFilter, setPoolFilter] = useState('')
  const [stateFilterId, setStateFilterId] = useState(0)
  const [nowSeconds, setNow] = useState<string>()

  const changeHandler = useCallback(() => {
    const buildWhere = () =>
      searchOptions.reduce((acc, option) => {
        return {
          ...acc,
          [option.filter]:
            searchFilter.filter === option.filter && searchString.length >= searchFilter.length
              ? searchString
              : null,
        }
      }, {})

    setWhere(buildWhere())
  }, [searchFilter.filter, searchFilter.length, searchString, setWhere])

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, DEBOUNCED_INPUT_TIME),
    [changeHandler],
  )

  useEffect(() => {
    setNow(Math.round(Date.now() / 1000).toString())
  }, [stateFilterId])

  useEffect(() => {
    debouncedChangeHandler()

    return () => {
      debouncedChangeHandler.cancel()
    }
  }, [debouncedChangeHandler, searchString])

  const networks = [{ id: undefined, name: 'All networks' }, ...getChainsByEnvironmentArray()]

  // - Open
  // - Awaiting deal
  // - Deal ready
  // - Vesting
  // - Complete
  const stages = useMemo(
    () => [
      {
        name: 'All stages',
        id: 0,
        where: {
          poolStatus: null,
          purchaseExpiry_lt: null,
          purchaseExpiry_gt: null,
          vestingStarts_lt: null,
          vestingEnds_gt: null,
          vestingEnds_lt: null,
        },
      },
      {
        name: 'Open',
        id: 1,
        where: {
          purchaseExpiry_lt: null,
          vestingStarts_lt: null,
          vestingEnds_gt: null,
          vestingEnds_lt: null,
          poolStatus: PoolStatus.PoolOpen,
          purchaseExpiry_gt: nowSeconds,
        },
      },
      {
        name: 'Awaiting deal',
        id: 2,
        where: {
          purchaseExpiry_gt: null,
          vestingStarts_lt: null,
          vestingEnds_gt: null,
          vestingEnds_lt: null,
          poolStatus: PoolStatus.PoolOpen,
          purchaseExpiry_lt: nowSeconds,
        },
      },
      {
        name: 'Deal ready',
        id: 3,
        where: {
          purchaseExpiry_lt: null,
          purchaseExpiry_gt: null,
          vestingStarts_lt: 1,
          vestingEnds_gt: null,
          vestingEnds_lt: null,
          poolStatus: PoolStatus.FundingDeal,
        },
      },
      {
        name: 'Vesting',
        id: 4,
        where: {
          poolStatus: PoolStatus.DealOpen,
          purchaseExpiry_lt: null,
          purchaseExpiry_gt: null,
          vestingEnds_lt: null,
          vestingStarts_lt: nowSeconds,
          vestingEnds_gt: nowSeconds,
        },
      },
      {
        name: 'Complete',
        id: 5,
        where: {
          poolStatus: PoolStatus.DealOpen,
          purchaseExpiry_lt: null,
          purchaseExpiry_gt: null,
          vestingStarts_lt: null,
          vestingEnds_gt: null,
          vestingEnds_lt: nowSeconds,
        },
      },
    ],
    [nowSeconds],
  )

  const getCurrentItem = (index: number) => (index < 0 ? 0 : index)

  useEffect(() => {
    if (poolFilter) {
      // All pools
      if (poolFilter === myPools[0]) {
        return setWhere({
          sponsor_in: null,
          holder_in: null,
          id_in: null,
        })
      }

      // My Sponsored pools
      if (address && poolFilter === myPools[1]) {
        return setWhere({
          sponsor_in: [address],
          holder_in: null,
          id_in: null,
        })
      }

      // My funded pools
      if (address && poolFilter === myPools[2]) {
        return setWhere({
          holder_in: [address],
          sponsor_in: null,
          id_in: null,
        })
      }

      // My invested pools
      if (address && poolFilter === myPools[3] && userPoolsInvested) {
        return setWhere({
          holder_in: null,
          sponsor_in: null,
          id_in: userPoolsInvested?.length ? userPoolsInvested.map(({ id }) => id) : [ZERO_ADDRESS],
        })
      }
    }
    return setWhere({
      sponsor_in: null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFilter])

  return (
    <>
      <Wrapper>
        <SearchWrapper>
          <Search
            onChange={async (evt) => {
              setSearchString(evt.target.value)
            }}
            placeholder={`Enter ${searchFilter.label.toLocaleLowerCase()}...`}
          />
          <SearchDropdown
            currentItem={getCurrentItem(
              searchOptions.findIndex((item) => item.filter === searchFilter.filter),
            )}
            dropdownButtonContent={
              <SearchDropdownButton>{searchFilter.label}</SearchDropdownButton>
            }
            dropdownPosition={DropdownPosition.right}
            items={searchOptions.map((item, key) => (
              <DropdownItem
                disabled={item.filter === 'sponsor_contains' && poolFilter === myPools[1]}
                key={key}
                onClick={() => {
                  setSearchFilter(item)
                }}
              >
                {item.label}
              </DropdownItem>
            ))}
          />
        </SearchWrapper>
        <FiltersDropdowns>
          <Dropdown
            currentItem={getCurrentItem(myPools.indexOf(poolFilter))}
            disabled={!isWalletConnected}
            dropdownButtonContent={
              <ButtonDropdown>{poolFilter ? poolFilter : myPools[0]}</ButtonDropdown>
            }
            items={myPools.map((item, key) => (
              <DropdownItem
                key={key}
                onClick={() => {
                  setSearchFilter(searchOptions[0])
                  setPoolFilter(item)
                }}
              >
                {item}
              </DropdownItem>
            ))}
          />
          <Dropdown
            currentItem={!network ? 0 : networks.findIndex(({ id }) => id === network)}
            dropdownButtonContent={
              <ButtonDropdown>
                {network ? networks.find(({ id }) => id === network)?.name : networks[0].name}
              </ButtonDropdown>
            }
            items={networks.map(({ id, name }, key) => (
              <DropdownItem key={key} onClick={() => setNetwork(Number(id) as ChainsValues)}>
                {name}
              </DropdownItem>
            ))}
          />
          <Dropdown
            currentItem={stateFilterId}
            dropdownButtonContent={<ButtonDropdown>{stages[stateFilterId].name}</ButtonDropdown>}
            dropdownPosition={DropdownPosition.right}
            items={stages.map((item, key) => (
              <DropdownItem
                key={key}
                onClick={() => {
                  setWhere(item.where)
                  setStateFilterId(item.id)
                }}
              >
                {item.name}
              </DropdownItem>
            ))}
          />
        </FiltersDropdowns>
      </Wrapper>
      <SafeSuspense>
        <List
          filters={{ variables, network }}
          setOrderBy={setOrderBy}
          setOrderDirection={setOrderDirection}
        />
      </SafeSuspense>
    </>
  )
}

export default genericSuspense(ListWithFilters)
