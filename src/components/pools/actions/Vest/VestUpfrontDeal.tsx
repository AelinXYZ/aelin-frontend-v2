import { useMemo } from 'react'

import { BigNumber } from 'alchemy-sdk'
import isAfter from 'date-fns/isAfter'
import ms from 'ms'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import HasTokensToClaim from '@/src/components/pools/actions/Vest/HasTokensToClaim'
import NothingToClaim from '@/src/components/pools/actions/Vest/NothingToClaim'
import PoolIsSyncing from '@/src/components/pools/actions/Vest/PoolSyncing'
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
  handleTransfer: () => void
}

function VestUpfrontDeal({ handleTransfer, pool }: Props) {
  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { data: vestingTokensData, mutate: refetchVestingTokensData } = useGetVestingTokens({
    chainId: pool.chainId,
    where: {
      dealAddress: pool.address,
      owner: address,
    },
    config: { refreshInterval: ms('5s') },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken: any) => Number(vestingToken.tokenId)) ?? []

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
    investorDealTotal = ZERO_BN,
    lastClaim = null,
    tokenToVestSymbol = '',
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

  const hasRemainingTokens = amountToVest.gt(ZERO_BN)

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

  const isTransferButtonDisabled = useMemo(() => {
    return (
      !address ||
      !isAppConnected ||
      !pool.isDealTokenTransferable ||
      tokenIds.length === 0 ||
      isHiddenPool(pool.address)
    )
  }, [address, isAppConnected, pool.isDealTokenTransferable, pool.address, tokenIds.length])

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

        refetch()
        refetchAmountToVest()
        refetchVestingTokensData()
      },
      title: `Vest ${tokenToVestSymbol}`,
      estimate: () =>
        pool.isDealTokenTransferable
          ? estimate([tokenIds] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>)
          : estimate([] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>),
    })
  }

  if (
    data?.vestingDeal === null ||
    (pool.isDealTokenTransferable &&
      data?.vestingDeal !== null &&
      tokenIds.length === 0 &&
      BigNumber.from(amountToVest).eq(ZERO_BN) &&
      BigNumber.from(totalVested).eq(ZERO_BN))
  ) {
    return <NothingToClaim />
  }

  if (
    pool.isDealTokenTransferable &&
    data?.vestingDeal !== null &&
    tokenIds.length === 0 &&
    BigNumber.from(totalVested).gt(ZERO_BN)
  ) {
    return (
      <VestingCompleted
        symbol={tokenToVestSymbol}
        totalVested={totalVested}
        underlyingDealTokenDecimals={underlyingDealTokenDecimals}
      />
    )
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
          handleTransfer={handleTransfer}
          handleVest={handleVest}
          isTransferButtonDisabled={isTransferButtonDisabled}
          isVestButtonDisabled={isVestButtonDisabled}
          symbol={tokenToVestSymbol}
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
            symbol={tokenToVestSymbol}
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
