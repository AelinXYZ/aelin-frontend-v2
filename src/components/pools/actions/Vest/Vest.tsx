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
import useGetVestingTokens from '@/src/hooks/aelin/useGetVestingTokens'
import {
  AelinDealCombined,
  useAelinDealTransaction,
} from '@/src/hooks/contracts/useAelinDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isHiddenPool } from '@/src/utils/isHiddenPool'

type Props = {
  pool: ParsedAelinPool
}

function Vest({ pool }: Props) {
  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { address, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { data: vestingTokensData } = useGetVestingTokens({
    chainId: pool.chainId,
    where: {
      dealAddress: pool.dealAddress,
      owner: address,
    },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken) => Number(vestingToken.tokenId)) ?? []

  const method = pool.isDealTokenTransferable ? 'claimUnderlyingMultipleEntries' : 'claim'

  const { estimate: estimateClaim, execute: claim } = useAelinDealTransaction(
    pool.dealAddress ?? ZERO_ADDRESS,
    method,
    pool.isDealTokenTransferable as boolean,
  )

  const { data, mutate: refetch } = useVestingDealById(
    {
      id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.dealAddress}`,
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

  const isVestingCliffEnded = isAfter(now, pool.deal?.vestingPeriod.cliff.end as Date)
  const isVestindPeriodEnded = isAfter(now, pool.deal?.vestingPeriod.vesting.end as Date)

  const withinInterval = isVestingCliffEnded && !isVestindPeriodEnded

  const [amountToVest, refetchAmountToVest] = useAelinAmountToVest(
    pool.isDealTokenTransferable,
    tokenIds,
    pool.address,
    pool.chainId,
    withinInterval,
  )

  const hasRemainingTokens =
    lastClaim !== null
      ? isBefore(new Date(lastClaim * 1000), pool.deal?.vestingPeriod.vesting.end as Date)
      : amountToVest.gt(ZERO_BN)

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
          ? await claim([tokenIds] as Parameters<AelinDealCombined['functions'][typeof method]>)
          : await claim(
              [] as Parameters<AelinDealCombined['functions'][typeof method]>,
              txGasOptions,
            )

        await refetch()
        await refetchAmountToVest()
      },
      title: `Vest ${data?.vestingDeal?.tokenToVestSymbol}`,
      estimate: () =>
        pool.isDealTokenTransferable
          ? estimateClaim([tokenIds] as Parameters<AelinDealCombined['functions'][typeof method]>)
          : estimateClaim([] as Parameters<AelinDealCombined['functions'][typeof method]>),
    })
  }

  if (data?.vestingDeal === null) {
    return <NothingToClaim />
  }

  return (
    <>
      {!isVestingCliffEnded && (
        <VestingCliff
          redemptionEnds={pool.deal?.redemption?.end}
          vestingCliffEnds={pool.deal?.vestingPeriod.cliff.end}
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

export default genericSuspense(Vest)
