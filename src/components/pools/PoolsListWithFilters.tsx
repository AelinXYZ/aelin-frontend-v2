import { ChangeEvent, useCallback, useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import debounce from 'lodash/debounce'

import { PoolCreated_Filter, PoolStatus } from '@/graphql-schema'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/dropdown/Dropdown'
import PoolsList from '@/src/components/pools/PoolsList'
import { ButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { ChainsValues, getChainsByEnvironmentArray } from '@/src/constants/chains'
import useAelinPoolsFilters from '@/src/hooks/aelin/useAelinPoolsFilters'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getStatusText } from '@/src/utils/aelinPool'

const Wrapper = styled.div`
  --gap: 20px;

  display: grid;
  gap: var(--gap);
  margin-bottom: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr 1fr;
  }
`

const FiltersDropdowns = styled.div`
  display: grid;
  gap: var(--gap);

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const SearchWrapper = styled.div`
  position: relative;
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
  &,
  &:hover {
    background: none;
    border: none;
  }
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

const myPools = ['All pools', 'Sponsored', 'Founded', 'Invested']

const DEBOUNCED_TIME = 500

const PoolsListWithFilters: React.FC = () => {
  const { address } = useWeb3Connection()
  const { network, setNetwork, setOrderBy, setOrderDirection, setWhere, variables } =
    useAelinPoolsFilters()

  const [searchFilter, setSearchFilter] = useState<SearchOptionsType>({
    filter: searchOptions[0].filter,
    label: searchOptions[0].label,
    length: searchOptions[0].length,
  })

  const [searchString, setSearchString] = useState<string>('')
  const [poolFilter, setPoolFilter] = useState('')

  const changeHandler = useCallback(
    (value: string, whereKey: keyof PoolCreated_Filter, minLength: number) => {
      const buildWhere = () =>
        searchOptions.reduce((acc, option) => {
          return {
            ...acc,
            [option.filter]:
              searchFilter.filter === option.filter && value.length >= minLength ? value : null,
          }
        }, {})

      setWhere(buildWhere())
    },
    [searchFilter.filter, setWhere],
  )

  const debouncedChangeHandler = debounce(changeHandler, DEBOUNCED_TIME)

  const networks = [{ id: undefined, name: 'All networks' }, ...getChainsByEnvironmentArray()]

  const stagesTexts = ['All stages', ...Object.values(PoolStatus).map((poolStatus) => poolStatus)]

  const getCurrentItem = (index: number) => (index < 0 ? 0 : index)

  useEffect(() => {
    if (poolFilter) {
      if (address && poolFilter === myPools[1]) {
        return setWhere({
          sponsor_in: [address],
        })
      }
    }
    return setWhere({
      sponsor_in: null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolFilter])

  useEffect(() => {
    if (searchString) debouncedChangeHandler(searchString, searchFilter.filter, searchFilter.length)
  }, [debouncedChangeHandler, searchFilter.filter, searchFilter.length, searchString])

  return (
    <>
      <Wrapper>
        <SearchWrapper>
          <Search
            onChange={(evt) => {
              setSearchString(evt.target.value)
              debouncedChangeHandler(evt.target.value, searchFilter.filter, searchFilter.length)
            }}
            placeholder={`Enter ${searchFilter.label.toLocaleLowerCase()}...`}
          />
          <SearchDropdown
            currentItem={getCurrentItem(myPools.indexOf(poolFilter))}
            dropdownButtonContent={
              <SearchDropdownButton>{searchFilter.label}</SearchDropdownButton>
            }
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
            currentItem={getCurrentItem(
              stagesTexts.indexOf(variables?.where?.poolStatus as string),
            )}
            dropdownButtonContent={
              <ButtonDropdown>
                {variables?.where?.poolStatus
                  ? getStatusText({ poolStatus: variables?.where?.poolStatus as PoolStatus })
                  : stagesTexts[0]}
              </ButtonDropdown>
            }
            dropdownPosition={DropdownPosition.right}
            items={stagesTexts.map((item, key) => (
              <DropdownItem
                key={key}
                onClick={() => {
                  setWhere({
                    poolStatus: !key ? null : (item as PoolStatus),
                  })
                }}
              >
                {getStatusText({ poolStatus: item as PoolStatus })}
              </DropdownItem>
            ))}
          />
        </FiltersDropdowns>
      </Wrapper>

      <PoolsList
        filters={{ variables, network }}
        setOrderBy={setOrderBy}
        setOrderDirection={setOrderDirection}
      />
    </>
  )
}

export default PoolsListWithFilters
