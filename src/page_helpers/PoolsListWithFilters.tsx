import { ChangeEvent, useCallback } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import debounce from 'lodash/debounce'

import { OrderDirection, PoolCreated_Filter, PoolCreated_OrderBy } from '@/graphql-schema'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/dropdown/Dropdown'
import { ButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { Search } from '@/src/components/pureStyledComponents/form/Search'
import { ChainsValues, getChainsByEnvironmentArray } from '@/src/constants/chains'
import useAelinPoolsFilters from '@/src/hooks/aelin/useAelinPoolsFilters'
import PoolsList from '@/src/page_helpers/PoolsList'

const Wrapper = styled.form`
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

const DEBOUNCED_TIME = 500

const PoolsListWithFilters: React.FC = () => {
  const { network, resetFilters, setNetwork, setOrderBy, setOrderDirection, setWhere, variables } =
    useAelinPoolsFilters()

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
  const [networkFilter, setNetworkFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const mockedPools = ['All pools', 'pool 1', 'pool 2', 'pool 3']
  const mockedNetworks = ['All networks', 'Ethereum', 'Optimism', 'Avalanche']
  const mockedStates = ['All pools', 'Open', 'Awaiting deal', 'Deal ready', 'Vesting']

  const getCurrentItem = (index: number) => (index < 0 ? 0 : index)

  return (
    <>
      {/* <input
        onChange={(evt) => debouncedChangeHandler(evt, 'sponsor_contains', 3)}
        type="text"
        value={variables?.where?.sponsor_contains}
      /> */}
      <Wrapper>
        <Search
          onChange={(evt) => debouncedChangeHandler(evt, 'sponsor_contains', 3)}
          placeholder="Pool name, sponsor, currency..."
          value={variables?.where?.sponsor_contains}
        />
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
            currentItem={getCurrentItem(mockedNetworks.indexOf(networkFilter))}
            dropdownButtonContent={
              <ButtonDropdown>{networkFilter ? networkFilter : mockedNetworks[0]}</ButtonDropdown>
            }
            items={mockedNetworks.map((item, key) => (
              <DropdownItem key={key} onClick={() => setNetworkFilter(item)}>
                {item}
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
    //   <form>
    //     <FiltersRow>
    //       <div>
    //         Sponsor:
    //         <input
    //           onChange={(evt) => debouncedChangeHandler(evt, 'sponsor_contains', 3)}
    //           type="text"
    //           value={variables?.where?.sponsor_contains}
    //         />
    //       </div>
    //       <div>
    //         Pool name:
    //         <input
    //           onChange={(evt) => debouncedChangeHandler(evt, 'name_contains_nocase', 3)}
    //           type="text"
    //         />
    //       </div>
    //       <div>
    //         Currency:
    //         <input
    //           onChange={(evt) =>
    //             debouncedChangeHandler(evt, 'purchaseTokenSymbol_contains_nocase', 2)
    //           }
    //           type="text"
    //         />
    //       </div>

    //       <div>
    //         Network:
    //         <select
    //           defaultValue={undefined}
    //           onChange={({ target }) => setNetwork(Number(target.value) as ChainsValues)}
    //         >
    //           <option value={undefined}>All pools</option>
    //           {getChainsByEnvironmentArray().map((chain) => (
    //             <option key={chain.id} value={chain.id}>
    //               {chain.name}
    //             </option>
    //           ))}
    //         </select>
    //       </div>

    //       <div>
    //         OrderBy:
    //         <select
    //           defaultValue={PoolCreated_OrderBy.Timestamp}
    //           onChange={({ target }) => setOrderBy(target.value as PoolCreated_OrderBy)}
    //         >
    //           {Object.values(PoolCreated_OrderBy).map((orderBy) => (
    //             <option key={orderBy} value={orderBy}>
    //               {orderBy}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       <div>
    //         OrderDirection:
    //         <select
    //           defaultValue={OrderDirection.Desc}
    //           onChange={({ target }) => setOrderDirection(target.value as OrderDirection)}
    //         >
    //           {Object.values(OrderDirection).map((orderBy) => (
    //             <option key={orderBy} value={orderBy}>
    //               {orderBy}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       <div>
    //         <input onClick={resetFilters} type="reset" value="Reset filters" />
    //       </div>
    //     </FiltersRow>
    //   </form>
  )
}

export default PoolsListWithFilters
