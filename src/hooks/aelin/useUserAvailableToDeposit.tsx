import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolCallMultiple } from '@/src/hooks/contracts/useAelinPoolCall'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { formatToken } from '@/src/web3/bigNumber'
import { DetailedNumber } from '@/types/utils'

export enum AmountTypes {
  maxDepositAllowed = 'maxDepositAllowed',
  maxDepositAllowedPrivate = 'maxDepositAllowedPrivate',
  investmentTokenBalance = 'investmentTokenBalance',
}

interface DetailedNumberExtended extends DetailedNumber {
  type: string
}

export type UserPoolBalance = {
  isUserAllowedToInvest: boolean
  userAlreadyInvested: boolean
  userMaxDepositPrivateAmount: DetailedNumberExtended
  refetchBalances: () => void
  investmentTokenBalance: DetailedNumberExtended
}

export function useUserAvailableToDeposit(pool: ParsedAelinPool): UserPoolBalance {
  const { address } = useWeb3Connection()

  const [investmentTokenBalance, refetchUserInvestmentTokenBalance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'balanceOf',
    [address || ZERO_ADDRESS],
  )

  const [[allowListAmount, userPoolBalance], refetchAllowListBalance] = useAelinPoolCallMultiple(
    pool.chainId,
    pool.address,
    [
      {
        method: 'allowList',
        params: [address || ''],
      },
      {
        method: 'balanceOf',
        params: [address || ''],
      },
    ],
  )

  const isUserAllowedToInvest = !isPrivatePool(pool.poolType)
    ? true
    : userPoolBalance.gt(ZERO_BN) || allowListAmount.gt(ZERO_BN)

  return {
    isUserAllowedToInvest,
    userMaxDepositPrivateAmount: {
      raw: allowListAmount,
      formatted: formatToken(allowListAmount, pool.investmentTokenDecimals),
      type: AmountTypes.maxDepositAllowedPrivate,
    },
    investmentTokenBalance: {
      raw: investmentTokenBalance || ZERO_BN,
      formatted: formatToken(investmentTokenBalance || ZERO_BN, pool.investmentTokenDecimals),
      type: AmountTypes.investmentTokenBalance,
    },
    userAlreadyInvested:
      isUserAllowedToInvest && isPrivatePool(pool.poolType) && allowListAmount.eq(ZERO_BN),
    refetchBalances: () => {
      refetchUserInvestmentTokenBalance()
      isPrivatePool(pool.poolType) && refetchAllowListBalance()
    },
  }
}
