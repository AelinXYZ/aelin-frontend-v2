import { useMemo } from 'react'

import { BigNumber } from 'alchemy-sdk'
import ms from 'ms'

import CommonTransferVestingShareModal from './CommonTransferVestingShareModal'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import useGetVestingTokens from '@/src/hooks/aelin/useGetVestingTokens'
import {
  AelinUpfrontDealCombined,
  useAelinUpfrontDealTransaction,
} from '@/src/hooks/contracts/useAelinUpfrontDealTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'
import { isHiddenPool } from '@/src/utils/isHiddenPool'

type Props = {
  poolAddress: string
  onClose: () => void
}

const UpfrontDealTransferVestingShareModal = ({ onClose, poolAddress }: Props) => {
  const { address, appChainId, isAppConnected } = useWeb3Connection()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { pool } = useAelinPool(appChainId, poolAddress, {
    refreshInterval: ms('5s'),
  })

  const { data: vestingTokensData } = useGetVestingTokens({
    chainId: pool.chainId,
    where: {
      dealAddress: pool.address,
      owner: address,
    },
  })

  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken: any) => Number(vestingToken.tokenId)) ?? []

  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]

  const { estimate: estimateTransferVestingShare, execute: executeTransferVestingShare } =
    useAelinUpfrontDealTransaction(
      pool.upfrontDeal?.address || ZERO_ADDRESS,
      'transferVestingShare',
      pool.isDealTokenTransferable,
    )

  const { estimate: estimateTransfer, execute: executeTransfer } = useAelinUpfrontDealTransaction(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    'transfer',
    pool.isDealTokenTransferable,
  )

  const { data, mutate: refetch } = useVestingDealById(
    {
      id: `${(address || ZERO_ADDRESS).toLowerCase()}-${pool.upfrontDeal?.address}`,
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

    console.log('xxx onConfirm isPartialTransfer:', isPartialTransfer)
    console.log('xxx onConfirm method:', method)
    console.log('xxx onConfirm tokenIds:', tokenIds)
    console.log('xxx onConfirm amount:', amount)
    console.log('xxx onConfirm toAddress:', toAddress)

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        isPartialTransfer
          ? await executeTransferVestingShare(
              [toAddress, 0, BigNumber.from(amount)] as Parameters<
                AelinUpfrontDealCombined['functions'][typeof method]
              >,
              txGasOptions,
            )
          : await executeTransfer(
              [toAddress, 0, '0x00'] as Parameters<
                AelinUpfrontDealCombined['functions'][typeof method]
              >,
              txGasOptions,
            )
        await refetch()
      },
      title: `Transfer ${tokenToVestSymbol}`,
      estimate: () =>
        isPartialTransfer
          ? estimateTransferVestingShare([toAddress, 0, BigNumber.from(amount)] as Parameters<
              AelinUpfrontDealCombined['functions'][typeof method]
            >)
          : estimateTransfer([toAddress, 0, '0x00'] as Parameters<
              AelinUpfrontDealCombined['functions'][typeof method]
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

export default UpfrontDealTransferVestingShareModal
