import { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'

import debounce from 'lodash/debounce'

import { OrderDirection, PoolCreated_Filter, PoolCreated_OrderBy } from '@/graphql-schema'
import { ChainsValues, getChainsByEnvironmentArray } from '@/src/constants/chains'
import useAelinPoolsFilters from '@/src/hooks/aelin/useAelinPoolsFilters'
import PoolsList from '@/src/page_helpers/PoolsList'

const FiltersRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const DEBOUNCED_TIME = 500

const PoolsListWithFilters = () => {
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

  return (
    <>
      <form>
        <FiltersRow>
          <div>
            Sponsor:
            <input
              onChange={(evt) => debouncedChangeHandler(evt, 'sponsor_contains', 3)}
              type="text"
              value={variables?.where?.sponsor_contains}
            />
          </div>
          <div>
            Pool name:
            <input
              onChange={(evt) => debouncedChangeHandler(evt, 'name_contains_nocase', 3)}
              type="text"
            />
          </div>
          <div>
            Currency:
            <input
              onChange={(evt) =>
                debouncedChangeHandler(evt, 'purchaseTokenSymbol_contains_nocase', 2)
              }
              type="text"
            />
          </div>

          <div>
            Network:
            <select
              defaultValue={undefined}
              onChange={({ target }) => setNetwork(Number(target.value) as ChainsValues)}
            >
              <option value={undefined}>All pools</option>
              {getChainsByEnvironmentArray().map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            OrderBy:
            <select
              defaultValue={PoolCreated_OrderBy.Timestamp}
              onChange={({ target }) => setOrderBy(target.value as PoolCreated_OrderBy)}
            >
              {Object.values(PoolCreated_OrderBy).map((orderBy) => (
                <option key={orderBy} value={orderBy}>
                  {orderBy}
                </option>
              ))}
            </select>
          </div>
          <div>
            OrderDirection:
            <select
              defaultValue={OrderDirection.Desc}
              onChange={({ target }) => setOrderDirection(target.value as OrderDirection)}
            >
              {Object.values(OrderDirection).map((orderBy) => (
                <option key={orderBy} value={orderBy}>
                  {orderBy}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input onClick={resetFilters} type="reset" value="Reset filters" />
          </div>
        </FiltersRow>
      </form>

      <PoolsList filters={{ variables, network }} />
    </>
  )
}

export default PoolsListWithFilters
