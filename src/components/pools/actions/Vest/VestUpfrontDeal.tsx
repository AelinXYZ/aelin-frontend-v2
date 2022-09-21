import { useMemo } from 'react'

import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import ms from 'ms'

import ClaimUpfrontDealTokens from './ClaimUpfrontDealTokens'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import NothingToClaim from '@/src/components/pools/actions/Vest/NothingToClaim'
import VestingCliff from '@/src/components/pools/actions/Vest/VestingCliff'
import VestingCompleted from '@/src/components/pools/actions/Vest/VestingCompleted'
import VestingPeriod from '@/src/components/pools/actions/Vest/VestingPeriod'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinAmountToVestUpfrontDeal from '@/src/hooks/aelin/useAelinAmountToVestUpfrontDeal'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolSharesPerUser from '@/src/hooks/aelin/useAelinPoolSharesPerUser'
import useAelinUserRoles from '@/src/hooks/aelin/useAelinUserRoles'
import { useAelinPoolUpfrontDealTransaction } from '@/src/hooks/contracts/useAelinPoolUpfrontDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isFirstAelinPool } from '@/src/utils/isFirstAelinPool'
import { UserRole } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
}

function VestUpfrontDeal({ pool }: Props) {
  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate, execute: claim } = useAelinPoolUpfrontDealTransaction(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    'claimUnderlying',
  )

  const { data, mutate: refetch } = useVestingDealById(
    {
      id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.upfrontDeal?.address}`,
    },
    { refreshInterval: ms('10s') },
  )

  const { investorDealTotal, lastClaim, totalVested, underlyingDealTokenDecimals } =
    data?.vestingDeal || {}

  const now = new Date()

  const isVestingCliffEnded = isAfter(now, pool.upfrontDeal?.vestingPeriod.cliff.end as Date)
  const isVestindPeriodEnded = isAfter(now, pool.upfrontDeal?.vestingPeriod.vesting.end as Date)

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded

  const [amountToVest, refetchAmountToVest] = useAelinAmountToVestUpfrontDeal(
    pool.address,
    pool.chainId,
    withinInterval,
  )

  const [poolShares] = useAelinPoolSharesPerUser(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    pool.upfrontDeal?.underlyingToken.decimals || 18,
    pool.chainId,
    withinInterval,
  )

  const hasRemainingTokens =
    Number(lastClaim) !== 0
      ? isBefore(lastClaim * 1000, pool.upfrontDeal?.vestingPeriod.vesting.end as Date)
      : amountToVest.gt(ZERO_BN)

  const userRoles = useAelinUserRoles(pool)

  const hasToClaimTokens = useMemo(() => {
    if (!pool.upfrontDeal) return false

    const sponsorClaim = !!pool.upfrontDeal.sponsorClaim
    const hasSponsorFees = !!pool.sponsorFee.raw.gt(ZERO_BN)
    const holderClaim = !!pool.upfrontDeal.holderClaim

    if (userRoles.includes(UserRole.Holder) && !holderClaim) return true
    if (userRoles.includes(UserRole.Sponsor) && hasSponsorFees && !sponsorClaim) return true
    if (userRoles.includes(UserRole.Investor) && poolShares.raw.gt(ZERO_BN)) return true

    return false
  }, [poolShares, pool, userRoles])

  const isVestButtonDisabled = useMemo(() => {
    return (
      !address ||
      !isAppConnected ||
      isSubmitting ||
      !hasRemainingTokens ||
      isFirstAelinPool(pool.address)
    )
  }, [address, hasRemainingTokens, isAppConnected, isSubmitting, pool.address])

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

  if (data?.vestingDeal === null && !hasToClaimTokens) {
    return <NothingToClaim />
  }

  return (
    <>
      {hasToClaimTokens && <ClaimUpfrontDealTokens pool={pool} />}
      {!isVestingCliffEnded && (
        <VestingCliff
          redemptionEnds={pool.upfrontDeal?.vestingPeriod.start}
          vestingCliffEnds={pool.upfrontDeal?.vestingPeriod.cliff.end}
        />
      )}
      {isVestingCliffEnded && hasRemainingTokens && (
        <VestingPeriod
          amountToVest={amountToVest}
          handleVest={handleVest}
          isButtonDisabled={isVestButtonDisabled}
          symbol={data?.vestingDeal?.tokenToVestSymbol}
          totalAmount={investorDealTotal}
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

export default genericSuspense(VestUpfrontDeal)
