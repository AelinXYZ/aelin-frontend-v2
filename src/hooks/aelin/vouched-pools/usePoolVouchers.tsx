import { useEffect, useState } from 'react'

import { ParsedAelinPool } from '../useAelinPool'
import useAelinUsers, { ParsedUserAmt } from '../useAelinUsers'
import useAelinVouchedPools from './useAelinVouchedPools'
import { OrderDirection, User_OrderBy } from '@/graphql-schema'

type ParsedCouncilAmt = Omit<
  ParsedUserAmt,
  'poolsInvestedAmt' | 'poolsAsHolderAmt' | 'poolsSponsoredAmt' | 'dealsAcceptedAmt' | 'history'
>

export default function usePoolVouchers(pool: ParsedAelinPool) {
  const [dataWithCouncil, setDataWithCouncil] = useState<ParsedCouncilAmt[]>([])
  const { data, error, hasMore, nextPage } = useAelinUsers({
    orderBy: User_OrderBy.PoolsVouchedAmt,
    orderDirection: OrderDirection.Desc,
    where: {
      poolsVouched_contains: [pool.address],
    },
  })

  const { data: aelinVouchedPools } = useAelinVouchedPools()

  useEffect(() => {
    if (
      aelinVouchedPools?.length &&
      aelinVouchedPools.find(({ address }) => address === pool.address)
    ) {
      const aelinCouncilVouch = {
        id: 'aelincouncil.eth',
        chainId: pool.chainId,
        poolsVouchedAmt: aelinVouchedPools.length,
      }
      setDataWithCouncil([aelinCouncilVouch])
    }
  }, [aelinVouchedPools, pool.address, pool.chainId])

  return {
    data: (data as ParsedCouncilAmt[]).concat(dataWithCouncil),
    hasMore,
    nextPage,
    error,
  }
}
