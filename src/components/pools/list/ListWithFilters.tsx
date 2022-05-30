import { useCallback, useEffect, useMemo } from 'react'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import debounce from 'lodash/debounce'

import { PoolCreated, PoolStatus } from '@/graphql-schema'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/common/Dropdown'
import { SafeSuspense, genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { List } from '@/src/components/pools/list/List'
import { ButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { ChainsValues, getChainsByEnvironmentArray } from '@/src/constants/config/chains'
import { DEBOUNCED_INPUT_TIME, ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinPoolsFilters from '@/src/hooks/aelin/useAelinPoolsFilters'
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
    background-color: ${({ theme }) => theme.searchDropdown.backgroundColor};
  }
`

const Search = styled(BaseSearch)`
  padding-right: 125px;
  position: relative;
  width: 100%;
  z-index: 1;
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

const myPools = ['All pools', 'Sponsored', 'Funded', 'Invested']

export const ListWithFilters = ({ userPoolsInvested }: { userPoolsInvested?: PoolCreated[] }) => {
  const { address, isWalletConnected } = useWeb3Connection()

  const { network, setNetwork, setOrderBy, setOrderDirection, setWhere, variables } =
    useAelinPoolsFilters()

  const [searchString, setSearchString] = useState('')
  const [poolFilter, setPoolFilter] = useState('')
  const [stateFilterId, setStateFilterId] = useState(0)
  const [nowSeconds, setNow] = useState<string>()

  const changeHandler = useCallback(
    () => setWhere({ filter_contains: searchString ? searchString.toLocaleLowerCase() : null }),
    [searchString, setWhere],
  )

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
            placeholder="Pool name, sponsor, currency..."
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
