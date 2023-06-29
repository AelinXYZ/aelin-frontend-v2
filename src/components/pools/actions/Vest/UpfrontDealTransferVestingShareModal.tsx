import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { Interface } from '@ethersproject/abi'
import { BigNumber } from 'alchemy-sdk'
import ms from 'ms'

import CommonTransferVestingShareModal from './CommonTransferVestingShareModal'
import { VestingToken } from '@/graphql-schema'
import AelinUpfrontDealTransferABI from '@/src/abis/AelinUpfrontDeal_v1.json'
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
  const router = useRouter()
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

  const method = 'multicall'
  const { estimate, execute } = useAelinUpfrontDealTransaction(
    pool.upfrontDeal?.address || ZERO_ADDRESS,
    method,
    pool.isDealTokenTransferable as boolean,
  )

  const allSDK = getAllGqlSDK()
  const { useVestingDealById } = allSDK[pool.chainId]
  const { data } = useVestingDealById(
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
    let partialTransferAmount = BigNumber.from(amount)

    for (const vestingToken of ascendingVestingTokens) {
      if (partialTransferAmount.gte(vestingToken.amount)) {
        transferTokenIds.push(vestingToken.tokenId)
        partialTransferAmount = partialTransferAmount.sub(vestingToken.amount)
        continue
      }

      partialTransferTokenId = vestingToken.tokenId
      break
    }

    const upfrontDealInterface = new Interface(AelinUpfrontDealTransferABI)
    const calls = transferTokenIds.map((tokenId) =>
      upfrontDealInterface.encodeFunctionData('transfer', [toAddress, tokenId, '0x00']),
    )
    if (partialTransferTokenId && partialTransferAmount.gt(ZERO_BN)) {
      calls.push(
        upfrontDealInterface.encodeFunctionData('transferVestingShare', [
          toAddress,
          partialTransferTokenId,
          partialTransferAmount,
        ]),
      )
    }

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        await execute(
          [calls] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
          txGasOptions,
        )
        router.reload()
      },
      title: `Transfer ${tokenToVestSymbol}`,
      estimate: () =>
        estimate([calls] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>),
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
