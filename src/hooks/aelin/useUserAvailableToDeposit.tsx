import { BigNumber } from '@ethersproject/bignumber'

import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolCall from '@/src/hooks/contracts/useAelinPoolCall'
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

export function useUserAvailableToDeposit(
  pool: ParsedAelinPool,
  userPoolBalance: BigNumber | null,
  refetchUserPoolBalance: () => void,
): UserPoolBalance {
  const { address } = useWeb3Connection()

  const [investmentTokenBalance, refetchUserInvestmentTokenBalance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'balanceOf',
    [address || ZERO_ADDRESS],
  )

  const [allowListAmount, refetchAllowListAmount] = useAelinPoolCall(
    pool.chainId,
    pool.address,
    'allowList',
    [address || ZERO_ADDRESS],
  )

  const isUserAllowedToInvest = !isPrivatePool(pool.poolType)
    ? true
    : (userPoolBalance ?? ZERO_BN).gt(ZERO_BN) || (allowListAmount ?? ZERO_BN).gt(ZERO_BN)

  return {
    isUserAllowedToInvest,
    userMaxDepositPrivateAmount: {
      raw: allowListAmount ?? ZERO_BN,
      formatted: formatToken(allowListAmount ?? ZERO_BN, pool.investmentTokenDecimals),
      type: AmountTypes.maxDepositAllowedPrivate,
    },
    investmentTokenBalance: {
      raw: investmentTokenBalance || ZERO_BN,
      formatted: formatToken(investmentTokenBalance || ZERO_BN, pool.investmentTokenDecimals),
      type: AmountTypes.investmentTokenBalance,
    },
    userAlreadyInvested:
      isUserAllowedToInvest &&
      isPrivatePool(pool.poolType) &&
      (allowListAmount ?? ZERO_BN).eq(ZERO_BN),
    refetchBalances: () => {
      refetchUserInvestmentTokenBalance()
      refetchUserPoolBalance()
      isPrivatePool(pool.poolType) && refetchAllowListAmount()
    },
  }
}
