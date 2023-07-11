import { useMemo } from 'react'

import { Interface } from '@ethersproject/abi'
import { BigNumber } from 'alchemy-sdk'
import ms from 'ms'

import CommonTransferVestingShareModal from './CommonTransferVestingShareModal'
import AelinDealTransferABI from '@/src/abis/AelinDeal_v1.json'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
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
    config: { refreshInterval: ms('5s') },
  })
  const tokenIds =
    vestingTokensData?.vestingTokens.map((vestingToken: any) => Number(vestingToken.tokenId)) ?? []

  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { data: vestingDealData } = useVestingDealById(
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

  const isTransferButtonDisabled = useMemo(() => {
    return (
      !address ||
      !isAppConnected ||
      !pool.isDealTokenTransferable ||
      tokenIds.length === 0 ||
      isHiddenPool(pool.address) ||
      isSubmitting
    )
  }, [
    address,
    isAppConnected,
    pool.isDealTokenTransferable,
    tokenIds.length,
    pool.address,
    isSubmitting,
  ])

  const handleTransfer = async (toAddress: string) => {
    const dealInterface = new Interface(AelinDealTransferABI)
    const calls = (vestingTokensData?.vestingTokens ?? []).map((vestingToken) =>
      dealInterface.encodeFunctionData('transfer', [toAddress, vestingToken.tokenId, '0x00']),
    )

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        execute([calls] as Parameters<AelinDealCombined['functions'][typeof method]>, txGasOptions)
        onClose()
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
