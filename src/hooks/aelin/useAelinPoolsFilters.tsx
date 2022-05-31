import { useReducer, useState } from 'react'

import cloneDeep from 'lodash/cloneDeep'

import { OrderDirection, PoolCreated_Filter, PoolCreated_OrderBy } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/config/chains'

type State = {
  orderBy: PoolCreated_OrderBy | null
  orderDirection: OrderDirection | null
  where: PoolCreated_Filter | null
}

type Action =
  | {
      type: 'setOrderBy'
      payload: PoolCreated_OrderBy
    }
  | {
      type: 'setOrderDirection'
      payload: OrderDirection
    }
  | {
      type: 'setWhere'
      payload: object | null
    }
  | {
      type: 'reset'
      payload: undefined
    }

const defaultFilters: State = {
  orderBy: PoolCreated_OrderBy.Timestamp,
  orderDirection: OrderDirection.Desc,
  where: null,
}

const reducer = (state: State, action: Action): State => {
  const { payload, type } = action
  switch (type) {
    case 'setOrderBy':
      return { ...state, orderBy: payload }
    case 'setOrderDirection':
      return { ...state, orderDirection: payload }
    case 'setWhere':
      return { ...state, where: payload }
    case 'reset':
      return defaultFilters
    default:
      return state
  }
}

const DEFAULT_ORDERBY = PoolCreated_OrderBy.Timestamp

export default function useAelinPoolsFilters() {
  const [state, dispatch] = useReducer(reducer, defaultFilters)
  const [network, setNetwork] = useState<ChainsValues | null>(null)

  const resetFilters = () => dispatch({ type: 'reset', payload: undefined })

  const setOrderBy = (value: PoolCreated_OrderBy | undefined) =>
    dispatch({ type: 'setOrderBy', payload: value || DEFAULT_ORDERBY })

  const setOrderDirection = (value: OrderDirection) =>
    dispatch({ type: 'setOrderDirection', payload: value })

  const setWhere = (value: PoolCreated_Filter) => {
    let where = cloneDeep(state.where)
    const whereProperties = Object.keys(value) as (keyof PoolCreated_Filter)[]

    whereProperties.map((whereKey) => {
      // Remove where filter key if exists in state and the value received is null
      if (where && whereKey in where && value[whereKey] === null) {
        delete where[whereKey]
      } else if (value[whereKey] !== null) {
        where = {
          ...where,
          [whereKey]: value[whereKey],
        }
      }
    })
    dispatch({ type: 'setWhere', payload: where })
  }

  return {
    setOrderBy,
    setOrderDirection,
    setWhere,
    setNetwork,
    network,
    variables: state,
    resetFilters,
  }
}
