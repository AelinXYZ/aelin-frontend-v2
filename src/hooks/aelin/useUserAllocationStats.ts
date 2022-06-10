import { BigNumber } from '@ethersproject/bignumber'
import { KeyedMutator } from 'swr'

import { UserAllocationStatQuery } from '@/graphql-schema'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { formatToken } from '@/src/web3/bigNumber'

type UserAllocationStats = {
  data: {
    raw: BigNumber
    formatted: string | undefined
    totalWithdrawn: BigNumber
  }
  refetch: KeyedMutator<UserAllocationStatQuery>
}

export function useUserAllocationStats(
  poolAddress: string | null,
  chainId: ChainsValues,
  investmentTokenDecimals: number,
): UserAllocationStats {
  const { address } = useWeb3Connection()
  const allSDK = getAllGqlSDK()
  const { useUserAllocationStat } = allSDK[chainId]
  const { data, mutate } = useUserAllocationStat({
    id: `${(address || ZERO_ADDRESS).toLowerCase()}-${poolAddress}`,
  })

  return {
    data: {
      raw: data?.userAllocationStat?.poolTokenBalance || ZERO_BN,
      formatted: data
        ? formatToken(data?.userAllocationStat?.poolTokenBalance, investmentTokenDecimals)
        : '0',
      totalWithdrawn: data?.userAllocationStat?.totalWithdrawn || ZERO_BN,
    },
    refetch: mutate,
  }
}
