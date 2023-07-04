import { useEffect, useMemo } from 'react'

import { Interface } from '@ethersproject/abi'
import { BigNumber } from 'alchemy-sdk'
import ms from 'ms'

import CommonTransferVestingShareModal from './CommonTransferVestingShareModal'
import { VestingToken } from '@/graphql-schema'
import AelinDealTransferABI from '@/src/abis/AelinDeal_v1.json'
import { BASE_DECIMALS, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
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
  poolAddress: string
  onClose: () => void
}

const TransferVestingShareModal = ({ onClose, poolAddress }: Props) => {
  const { address, appChainId, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { pool } = useAelinPool(appChainId, poolAddress, {
    refreshInterval: ms('5s'),
  })

  const { data: vestingTokensData, mutate: refetchVestingTokensData } = useGetVestingTokens({
    chainId: pool.chainId,
    where: {
      dealAddress: pool.dealAddress,
      owner: address,
    },
    config: { refreshInterval: ms('5s') },
  })

  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { data: vestingDealData, mutate: refetchVestingDealData } = useVestingDealById(
    {
      id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.dealAddress}`,
    },
    { refreshInterval: ms('5s') },
  )

  const {
    investorDealTotal = ZERO_BN,
    tokenToVestSymbol,
    totalVested = ZERO_BN,
    underlyingDealTokenDecimals,
  } = vestingDealData?.vestingDeal ?? {}

  const method = 'multicall'
  const { estimate, execute } = useAelinDealTransaction(
    pool.dealAddress ?? ZERO_ADDRESS,
    method,
    pool.isDealTokenTransferable as boolean,
  )

  useEffect(() => {
    if (BigNumber.from(investorDealTotal).eq(ZERO_BN)) {
      onClose()
    }
  }, [investorDealTotal, onClose])

  const isTransferButtonDisabled = useMemo(() => {
    return (
      !address ||
      !isAppConnected ||
      !pool.isDealTokenTransferable ||
      BigNumber.from(investorDealTotal).lte(ZERO_BN) ||
      isHiddenPool(pool.address) ||
      isSubmitting
    )
  }, [
    address,
    isAppConnected,
    pool.isDealTokenTransferable,
    investorDealTotal,
    pool.address,
    isSubmitting,
  ])

  const handleTransfer = async (
    amount: string,
    toAddress: string,
    clearInputValues: () => void,
  ) => {
    if (!pool.deal) {
      throw new Error('Deal not found.')
    }

    const underlyingDealTokenDecimal = underlyingDealTokenDecimals ?? BASE_DECIMALS
    const convertedAmount = BigNumber.from(amount)
      .mul(BigNumber.from('10').pow(BASE_DECIMALS - underlyingDealTokenDecimal))
      .mul(pool.deal.exchangeRates.dealPerInvestment.raw)
      .div(
        BigNumber.from('10').pow(
          underlyingDealTokenDecimal > pool.investmentTokenDecimals
            ? underlyingDealTokenDecimal
            : pool.investmentTokenDecimals,
        ),
      )

    const compare = (a: VestingToken, b: VestingToken) => {
      if (BigNumber.from(a.amount).lt(BigNumber.from(b.amount))) {
        return -1
      }

      if (BigNumber.from(a.amount).gt(BigNumber.from(b.amount))) {
        return 1
      }

      return 0
    }

    const ascendingVestingTokens = (vestingTokensData?.vestingTokens ?? []).sort(compare)
    const transferTokenIds: number[] = []
    let partialTransferTokenId: number | null = null
    let partialTransferAmount = convertedAmount

    for (const vestingToken of ascendingVestingTokens) {
      if (partialTransferAmount.gte(vestingToken.amount)) {
        transferTokenIds.push(vestingToken.tokenId)
        partialTransferAmount = partialTransferAmount.sub(vestingToken.amount)
        continue
      }

      partialTransferTokenId = vestingToken.tokenId
      break
    }

    const dealInterface = new Interface(AelinDealTransferABI)
    const calls = transferTokenIds.map((tokenId) =>
      dealInterface.encodeFunctionData('transfer', [toAddress, tokenId, '0x00']),
    )
    if (partialTransferTokenId && partialTransferAmount.gt(ZERO_BN)) {
      calls.push(
        dealInterface.encodeFunctionData('transferVestingShare', [
          toAddress,
          partialTransferTokenId,
          partialTransferAmount,
        ]),
      )
    }

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await execute(
          [calls] as Parameters<AelinDealCombined['functions'][typeof method]>,
          txGasOptions,
        )
        clearInputValues()
        refetchVestingTokensData()
        refetchVestingDealData()
      },
      title: `Transfer ${tokenToVestSymbol}`,
      estimate: () =>
        estimate([calls] as Parameters<AelinDealCombined['functions'][typeof method]>),
    })
  }

  return (
    <CommonTransferVestingShareModal
      isTransferButtonDisabled={isTransferButtonDisabled}
      onClose={onClose}
      onTransfer={handleTransfer}
      symbol={tokenToVestSymbol}
      totalAmount={BigNumber.from(investorDealTotal).sub(BigNumber.from(totalVested))}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
    />
  )
}

export default TransferVestingShareModal
