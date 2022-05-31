import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import isAfter from 'date-fns/isAfter'
import ms from 'ms'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import VestingCliff from '@/src/components/pools/actions/Vest/VestingCliff'
import VestingCompleted from '@/src/components/pools/actions/Vest/VestingCompleted'
import VestingPeriod from '@/src/components/pools/actions/Vest/VestingPeriod'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinAmountToVest from '@/src/hooks/aelin/useAelinAmountToVest'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinDealTransaction } from '@/src/hooks/contracts/useAelinDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

type Props = {
  pool: ParsedAelinPool
}

function Vest({ pool }: Props) {
  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate, execute: claim } = useAelinDealTransaction(
    pool.dealAddress || ZERO_ADDRESS,
    'claim',
  )

  const { data, mutate: refetch } = useVestingDealById(
    {
      id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.dealAddress}`,
    },
    { refreshInterval: ms('10s') },
  )

  const { totalVested, underlyingDealTokenDecimals } = data?.vestingDeal || {}

  const now = new Date()
  const isVestingCliffEnded = isAfter(now, pool.deal?.vestingPeriod.cliff.end as Date)
  const isVestindPeriodEnded = isAfter(now, pool.deal?.vestingPeriod.vesting.end as Date)

  const hasRemainingTokens = !(
    BigNumber.from(data?.vestingDeal?.remainingAmountToVest || 0).eq(ZERO_BN) ||
    // Temp fix: Sometimes remainingAmountToVest is negative
    BigNumber.from(data?.vestingDeal?.remainingAmountToVest || 0).lt(ZERO_BN)
  )

  const isVestButtonDisabled = useMemo(() => {
    return !address || !isAppConnected || isSubmitting || !hasRemainingTokens
  }, [address, hasRemainingTokens, isAppConnected, isSubmitting])

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded
  const [amountToVest, refetchAmountToVest] = useAelinAmountToVest(
    pool.address,
    pool.chainId,
    withinInterval,
  )

  const handleVest = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await claim([], txGasOptions)
        await refetch()
        await refetchAmountToVest()
      },
      title: `Vest ${data?.vestingDeal?.tokenToVestSymbol}`,
      estimate: () => estimate([]),
    })
  }

  if (data?.vestingDeal === null) return null

  return (
    <>
      {!isVestingCliffEnded && (
        <VestingCliff
          redemtionEnds={pool.deal?.redemption?.end}
          vestingCliffEnds={pool.deal?.vestingPeriod.cliff.end}
        />
      )}
      {isVestingCliffEnded && hasRemainingTokens && (
        <VestingPeriod
          amountToVest={amountToVest}
          handleVest={handleVest}
          isButtonDisabled={isVestButtonDisabled}
          symbol={data?.vestingDeal?.tokenToVestSymbol}
          totalVested={totalVested}
          underlyingDealTokenDecimals={underlyingDealTokenDecimals}
        />
      )}
      {isVestingCliffEnded && isVestindPeriodEnded && !hasRemainingTokens && (
        <VestingCompleted
          symbol={data?.vestingDeal?.tokenToVestSymbol}
          totalVested={totalVested}
          underlyingDealTokenDecimals={underlyingDealTokenDecimals}
        />
      )}
    </>
  )
}

export default genericSuspense(Vest)
