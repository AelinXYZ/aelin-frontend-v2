import { DISPLAY_DECIMALS, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinUserMerkleTreeData from '@/src/hooks/aelin/merkle-tree/useAelinUserMerkleTreeData'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinUpfrontDealCallMultiple } from '@/src/hooks/contracts/useAelinUpfrontDealCall'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isMerklePool, isPrivatePool } from '@/src/utils/aelinPoolUtils'
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
  userAllowance: DetailedNumberExtended
  investmentTokenBalance: DetailedNumberExtended
  refetchUserAllowance: () => void
}

export function useUserAvailableToDepositUpfrontDeal(pool: ParsedAelinPool): UserPoolBalance {
  const { address } = useWeb3Connection()

  const [investmentTokenBalance, refetchUserInvestmentTokenBalance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'balanceOf',
    [address || ZERO_ADDRESS],
  )

  const [userAllowance, refetchUserAllowance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'allowance',
    [address || ZERO_ADDRESS, pool.address],
  )

  const [[allowListValues, userPoolBalance], refetchAllowListBalance] =
    useAelinUpfrontDealCallMultiple(pool.chainId, pool.address, pool.isDealTokenTransferable, [
      {
        method: 'getAllowList',
        params: [address || ''],
      },
      {
        method: 'balanceOf',
        params: [address || ''],
      },
    ])

  const allowlistAddresses = allowListValues[0]
  const allowListAmount = allowListValues[2]

  const userMerkleData = useAelinUserMerkleTreeData(pool)

  const isUserAllowedToInvest = !isPrivatePool(pool.poolType)
    ? isMerklePool(pool)
      ? userMerkleData?.isElegible
      : true
    : userPoolBalance.gt(ZERO_BN) || allowlistAddresses.some((add: string) => add === address)

  const userAlreadyInvested = isMerklePool(pool)
    ? userMerkleData?.hasInvested
    : isUserAllowedToInvest && isPrivatePool(pool.poolType) && allowListAmount.eq(ZERO_BN)

  const allowedAmountToDeposit = isMerklePool(pool)
    ? userMerkleData?.data.amount || ZERO_BN
    : allowListAmount

  return {
    isUserAllowedToInvest,
    userMaxDepositPrivateAmount: {
      raw: allowedAmountToDeposit,
      formatted: formatToken(
        allowedAmountToDeposit,
        pool.investmentTokenDecimals,
        DISPLAY_DECIMALS,
      ),
      type: AmountTypes.maxDepositAllowedPrivate,
    },
    investmentTokenBalance: {
      raw: investmentTokenBalance || ZERO_BN,
      formatted: formatToken(
        investmentTokenBalance || ZERO_BN,
        pool.investmentTokenDecimals,
        DISPLAY_DECIMALS,
      ),
      type: AmountTypes.investmentTokenBalance,
    },
    userAllowance: {
      raw: userAllowance || ZERO_BN,
      formatted: formatToken(
        userAllowance || ZERO_BN,
        pool.investmentTokenDecimals,
        DISPLAY_DECIMALS,
      ),
      type: AmountTypes.investmentTokenBalance,
    },
    userAlreadyInvested,
    refetchBalances: () => {
      refetchUserInvestmentTokenBalance()
      isPrivatePool(pool.poolType) && refetchAllowListBalance()
    },
    refetchUserAllowance,
  }
}
