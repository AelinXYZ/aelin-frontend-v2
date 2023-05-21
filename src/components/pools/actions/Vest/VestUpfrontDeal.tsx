import { useMemo } from 'react'

import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import ms from 'ms'

import HasTokensToClaim from './HasTokensToClaim'
import PoolIsSyncing from './PoolSyncing'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import NothingToClaim from '@/src/components/pools/actions/Vest/NothingToClaim'
import VestingCliff from '@/src/components/pools/actions/Vest/VestingCliff'
import VestingCompleted from '@/src/components/pools/actions/Vest/VestingCompleted'
import VestingPeriod from '@/src/components/pools/actions/Vest/VestingPeriod'
import { BASE_DECIMALS, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinAmountToVestUpfrontDeal from '@/src/hooks/aelin/useAelinAmountToVestUpfrontDeal'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolSharesPerUser from '@/src/hooks/aelin/useAelinPoolSharesPerUser'
import useAelinUserRoles from '@/src/hooks/aelin/useAelinUserRoles'
import useGetVestingTokens from '@/src/hooks/aelin/useGetVestingTokens'
import {
  AelinUpfrontDealCombined,
  useAelinUpfrontDealTransaction,
} from '@/src/hooks/contracts/useAelinUpfrontDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isHiddenPool } from '@/src/utils/isHiddenPool'
import { UserRole } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
}

function VestUpfrontDeal({ pool }: Props) {
  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { data: vestingTokensData } = useGetVestingTokens({
    chainId: pool.chainId,
    where: {
      dealAddress: pool.address,
      owner: address,
    },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken) => Number(vestingToken.tokenId)) ?? []

  const method = pool.isDealTokenTransferable ? 'claimUnderlyingMultipleEntries' : 'claimUnderlying'

  const { estimate, execute: claim } = useAelinUpfrontDealTransaction(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    method,
    pool.isDealTokenTransferable,
  )

  const { data, mutate: refetch } = useVestingDealById(
    {
      id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.upfrontDeal?.address}`,
    },
    { refreshInterval: ms('10s') },
  )

  const {
    investorDealTotal,
    lastClaim = null,
    totalVested = ZERO_BN,
    underlyingDealTokenDecimals,
  } = data?.vestingDeal ?? {}

  const now = new Date()

  const isVestingCliffEnded = isAfter(now, pool.upfrontDeal?.vestingPeriod.cliff.end as Date)
  const isVestingPeriodEnded = isAfter(now, pool.upfrontDeal?.vestingPeriod.vesting.end as Date)

  const withinInterval = isVestingCliffEnded && !isVestingPeriodEnded

  const [amountToVest, refetchAmountToVest] = useAelinAmountToVestUpfrontDeal(
    pool.isDealTokenTransferable,
    tokenIds,
    pool.address,
    pool.chainId,
    withinInterval,
  )

  const [poolShares] = useAelinPoolSharesPerUser(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    pool.upfrontDeal?.underlyingToken.decimals || BASE_DECIMALS,
    pool.chainId,
    withinInterval,
    pool.isDealTokenTransferable,
  )

  const hasClaimedAtLeastOnce = lastClaim !== null
  const sponsorClaim = !!pool.upfrontDeal?.sponsorClaim
  const hasSponsorFees = !!pool.sponsorFee.raw.gt(ZERO_BN)

  const hasRemainingTokens = hasClaimedAtLeastOnce
    ? isBefore(new Date(lastClaim * 1000), pool.upfrontDeal?.vestingPeriod.vesting.end as Date)
    : amountToVest.gt(ZERO_BN)

  const userRoles = useAelinUserRoles(pool)

  const hasToClaimTokens = useMemo(() => {
    if (!pool.upfrontDeal) return false

    if (userRoles.includes(UserRole.Sponsor) && hasSponsorFees && !sponsorClaim) return true
    if (userRoles.includes(UserRole.Investor) && poolShares.raw.gt(ZERO_BN)) return true

    return false
  }, [pool.upfrontDeal, userRoles, hasSponsorFees, sponsorClaim, poolShares.raw])

  const isVestButtonDisabled = useMemo(() => {
    return (
      !address ||
      !isAppConnected ||
      isSubmitting ||
      !hasRemainingTokens ||
      isHiddenPool(pool.address)
    )
  }, [address, hasRemainingTokens, isAppConnected, isSubmitting, pool.address])

  const handleVest = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        pool.isDealTokenTransferable
          ? await claim(
              [tokenIds] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
              txGasOptions,
            )
          : await claim(
              [] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
              txGasOptions,
            )

        await refetch()
        await refetchAmountToVest()
      },
      title: `Vest ${data?.vestingDeal?.tokenToVestSymbol}`,
      estimate: () =>
        pool.isDealTokenTransferable
          ? estimate([tokenIds] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>)
          : estimate([] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>),
    })
  }

  if (
    userRoles.includes(UserRole.Visitor) ||
    (!userRoles.includes(UserRole.Investor) && userRoles.includes(UserRole.Holder)) ||
    (!userRoles.includes(UserRole.Investor) &&
      userRoles.includes(UserRole.Sponsor) &&
      !hasSponsorFees)
  ) {
    return <NothingToClaim />
  }

  return (
    <>
      {hasToClaimTokens && (
        <HasTokensToClaim
          showLine={isVestingCliffEnded && hasToClaimTokens && hasClaimedAtLeastOnce}
        />
      )}
      {!hasToClaimTokens && !isVestingCliffEnded && (
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
      {isVestingCliffEnded &&
        isVestingPeriodEnded &&
        !hasRemainingTokens &&
        hasClaimedAtLeastOnce && (
          <VestingCompleted
            symbol={data?.vestingDeal?.tokenToVestSymbol}
            totalVested={totalVested}
            underlyingDealTokenDecimals={underlyingDealTokenDecimals}
          />
        )}
      {!hasToClaimTokens && !hasRemainingTokens && isVestingCliffEnded && !isVestingPeriodEnded && (
        <PoolIsSyncing />
      )}
    </>
  )
}

export default genericSuspense(VestUpfrontDeal)
