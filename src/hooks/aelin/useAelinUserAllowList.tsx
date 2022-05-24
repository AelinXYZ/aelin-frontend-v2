import { ZERO_BN } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolCall from '@/src/hooks/contracts/useAelinPoolCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { formatToken } from '@/src/web3/bigNumber'
import { DetailedNumber } from '@/types/utils'

export type UserAllowList = {
  isUserAllowedToInvest: boolean
  userMaxAmount: DetailedNumber
}

export function useUserAllowList(pool: ParsedAelinPool): UserAllowList {
  const { address } = useWeb3Connection()

  const [allowListAmount] = useAelinPoolCall(pool.chainId, pool.address, 'allowList', [
    address || '',
  ])

  return {
    isUserAllowedToInvest: isPrivatePool(pool.poolType)
      ? allowListAmount?.gt(ZERO_BN) || false
      : true,
    userMaxAmount: {
      raw: allowListAmount || ZERO_BN,
      formatted: formatToken(allowListAmount || ZERO_BN, pool.investmentTokenDecimals),
    },
  }
}
