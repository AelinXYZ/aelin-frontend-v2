import { ChangeEvent, useCallback } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import debounce from 'lodash/debounce'

import { PoolCreated_Filter } from '@/graphql-schema'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/dropdown/Dropdown'
import PoolsList from '@/src/components/pools/PoolsList'
import { ButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { ChainsValues, getChainsByEnvironmentArray } from '@/src/constants/chains'
import useAelinPoolsFilters from '@/src/hooks/aelin/useAelinPoolsFilters'

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

const DEBOUNCED_TIME = 500

const PoolsListWithFilters: React.FC = () => {
  const { network, setNetwork, setWhere, variables } = useAelinPoolsFilters()

  const changeHandler = useCallback(
    (evt: ChangeEvent<HTMLInputElement>, whereKey: keyof PoolCreated_Filter, minLength: number) => {
      const { value } = evt.target
      setWhere({
        [whereKey]: value.length >= minLength ? value : null,
      })
    },
    [setWhere],
  )

  const debouncedChangeHandler = debounce(changeHandler, DEBOUNCED_TIME)

  const [poolFilter, setPoolFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')

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
  const [searchFilter, setSearchFilter] = useState<SearchOptionsType>({
    filter: searchOptions[0].filter,
    label: searchOptions[0].label,
    length: searchOptions[0].length,
  })
  const mockedPools = ['All pools', 'pool 1', 'pool 2', 'pool 3']
  const networks = [{ id: undefined, name: 'All networks' }, ...getChainsByEnvironmentArray()]
  const mockedStates = ['All stages', 'Open', 'Awaiting deal', 'Deal ready', 'Vesting']

  const getCurrentItem = (index: number) => (index < 0 ? 0 : index)

  return (
    <>
      <Wrapper>
        <SearchWrapper>
          <Search
            onChange={(evt) => {
              debouncedChangeHandler(evt, searchFilter.filter, searchFilter.length)
            }}
            placeholder={`Enter ${searchFilter.label.toLocaleLowerCase()}...`}
          />
          <SearchDropdown
            currentItem={getCurrentItem(mockedPools.indexOf(poolFilter))}
            dropdownButtonContent={
              <SearchDropdownButton>{searchFilter.label}</SearchDropdownButton>
            }
            items={searchOptions.map((item, key) => (
              <DropdownItem key={key} onClick={() => setSearchFilter(item)}>
                {item.label}
              </DropdownItem>
            ))}
          />
        </SearchWrapper>
        <FiltersDropdowns>
          <Dropdown
            currentItem={getCurrentItem(mockedPools.indexOf(poolFilter))}
            dropdownButtonContent={
              <ButtonDropdown>{poolFilter ? poolFilter : mockedPools[0]}</ButtonDropdown>
            }
            items={mockedPools.map((item, key) => (
              <DropdownItem key={key} onClick={() => setPoolFilter(item)}>
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
            currentItem={getCurrentItem(mockedStates.indexOf(stateFilter))}
            dropdownButtonContent={
              <ButtonDropdown>{stateFilter ? stateFilter : mockedStates[0]}</ButtonDropdown>
            }
            dropdownPosition={DropdownPosition.right}
            items={mockedStates.map((item, key) => (
              <DropdownItem key={key} onClick={() => setStateFilter(item)}>
                {item}
              </DropdownItem>
            ))}
          />
        </FiltersDropdowns>
      </Wrapper>
      <PoolsList filters={{ variables, network }} />
    </>
  )
}

export default PoolsListWithFilters
