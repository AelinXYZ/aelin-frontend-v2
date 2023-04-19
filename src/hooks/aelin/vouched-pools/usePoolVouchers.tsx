import { useEffect, useState } from 'react'

import { OrderDirection, User_OrderBy } from '@/graphql-schema'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinUsers, { ParsedUserAmt } from '@/src/hooks/aelin/useAelinUsers'
import useAelinVouchedPools from '@/src/hooks/aelin/vouched-pools/useAelinVouchedPools'

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

  const hasCouncilVouched =
    aelinVouchedPools?.length && aelinVouchedPools.find(({ address }) => address === pool.address)

  useEffect(() => {
    if (hasCouncilVouched) {
      const aelinCouncilVouch = {
        id: 'aelincouncil.eth',
        chainId: pool.chainId,
        poolsVouchedAmt: aelinVouchedPools.length,
      }
      setDataWithCouncil([aelinCouncilVouch])
    }
  }, [aelinVouchedPools.length, hasCouncilVouched, pool.address, pool.chainId])

  return {
    data: (data as ParsedCouncilAmt[]).concat(dataWithCouncil),
    hasMore,
    nextPage,
    error,
  }
}
