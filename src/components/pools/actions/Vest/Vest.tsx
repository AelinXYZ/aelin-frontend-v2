import { useMemo } from 'react'

import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import ms from 'ms'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import NothingToClaim from '@/src/components/pools/actions/Vest/NothingToClaim'
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

  const { lastClaim, totalVested, underlyingDealTokenDecimals } = data?.vestingDeal || {}

  const now = new Date()

  const isVestingCliffEnded = isAfter(now, pool.deal?.vestingPeriod.cliff.end as Date)
  const isVestindPeriodEnded = isAfter(now, pool.deal?.vestingPeriod.vesting.end as Date)

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded

  const [amountToVest, refetchAmountToVest] = useAelinAmountToVest(
    pool.address,
    pool.chainId,
    withinInterval,
  )

  const hasRemainingTokens =
    Number(lastClaim) !== 0
      ? isBefore(lastClaim * 1000, pool.deal?.vestingPeriod.vesting.end as Date)
      : !amountToVest.eq(ZERO_BN)

  const isVestButtonDisabled = useMemo(() => {
    return !address || !isAppConnected || isSubmitting || !hasRemainingTokens
  }, [address, hasRemainingTokens, isAppConnected, isSubmitting])

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

  if (data?.vestingDeal === null) {
    return <NothingToClaim />
  }

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
