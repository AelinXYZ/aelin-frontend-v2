import { useMemo } from 'react'

import { BigNumber } from 'alchemy-sdk'
import ms from 'ms'

import CommonTransferVestingShareModal from './CommonTransferVestingShareModal'
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

  const { data: vestingTokensData } = useGetVestingTokens({
    chainId: pool.chainId,
    where: {
      dealAddress: pool.dealAddress,
      owner: address,
    },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken: any) => Number(vestingToken.tokenId)) ?? []

  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]

  const { estimate: estimateTransferVestingShare, execute: executeTransferVestingShare } =
    useAelinDealTransaction(
      pool.dealAddress ?? ZERO_ADDRESS,
      'transferVestingShare',
      pool.isDealTokenTransferable as boolean,
    )

  const { estimate: estimateTransfer, execute: executeTransfer } = useAelinDealTransaction(
    pool.dealAddress ?? ZERO_ADDRESS,
    'transfer',
    pool.isDealTokenTransferable as boolean,
  )

  const { data, mutate: refetch } = useVestingDealById(
    {
      id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.dealAddress}`,
    },
    { refreshInterval: ms('5s') },
  )

  const {
    investorDealTotal = ZERO_BN,
    tokenToVestSymbol,
    underlyingDealTokenDecimals,
  } = data?.vestingDeal ?? {}

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

  const handleTransfer = async (amount: string, toAddress: string) => {
    const isPartialTransfer = BigNumber.from(investorDealTotal).gt(BigNumber.from(amount))
    const method = isPartialTransfer ? 'transferVestingShare' : 'transfer'

    if (!pool.deal) {
      throw new Error('Deal not found.')
    }

    const convertedAmount = BigNumber.from(amount)
      .mul(BigNumber.from('10').pow(BASE_DECIMALS - (underlyingDealTokenDecimals ?? BASE_DECIMALS)))
      .mul(
        pool.deal.exchangeRates.dealPerInvestment.raw.div(
          BigNumber.from('10').pow(pool.investmentTokenDecimals),
        ),
      )

    console.log('xxx onConfirm isPartialTransfer:', isPartialTransfer)
    console.log('xxx onConfirm method:', method)
    console.log('xxx onConfirm tokenIds:', tokenIds)
    console.log('xxx onConfirm convertedAmount:', convertedAmount.toString())
    console.log('xxx onConfirm toAddress:', toAddress)

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        isPartialTransfer
          ? await executeTransferVestingShare(
              [toAddress, 0, convertedAmount] as Parameters<
                AelinDealCombined['functions'][typeof method]
              >,
              txGasOptions,
            )
          : await executeTransfer(
              [toAddress, 0, '0x00'] as Parameters<AelinDealCombined['functions'][typeof method]>,
              txGasOptions,
            )
        await refetch()
      },
      title: `Transfer ${tokenToVestSymbol}`,
      estimate: () =>
        isPartialTransfer
          ? estimateTransferVestingShare([toAddress, 0, convertedAmount] as Parameters<
              AelinDealCombined['functions'][typeof method]
            >)
          : estimateTransfer([toAddress, 0, '0x00'] as Parameters<
              AelinDealCombined['functions'][typeof method]
            >),
    })
  }

  return (
    <CommonTransferVestingShareModal
      isTransferButtonDisabled={isTransferButtonDisabled}
      onClose={onClose}
      onTransfer={handleTransfer}
      symbol={tokenToVestSymbol}
      totalAmount={BigNumber.from(investorDealTotal)}
      underlyingDealTokenDecimals={underlyingDealTokenDecimals}
    />
  )
}

export default TransferVestingShareModal
