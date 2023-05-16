import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import ms from 'ms'

import AelinDealABI from '@/src/abis/AelinDeal.json'
import AelinDealV1ABI from '@/src/abis/AelinDeal_v1.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import useAelinDealCall, { AelinDealCombined } from '@/src/hooks/contracts/useAelinDealCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'

export const fetchAmountToVest = (
  isDealTokenTransferable: boolean,
  tokenIds: number[],
  dealAddress: string,
  chainId: ChainsValues,
  userAddress: string,
) => {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  if (isDealTokenTransferable) {
    return contractCall(
      dealAddress as string,
      AelinDealV1ABI,
      provider,
      'claimableUnderlyingTokens',
      [tokenIds],
    )
  } else {
    return contractCall(dealAddress as string, AelinDealABI, provider, 'claimableTokens', [
      userAddress,
    ]).then(([amountToVest]) => amountToVest)
  }
}

export default function useAelinAmountToVest(
  isDealTokenTransferable: boolean,
  tokenIds: number[],
  poolAddress: string,
  chainId: ChainsValues,
  withinInterval: boolean,
): [BigNumber, () => void] {
  const { address } = useWeb3Connection()
  const {
    pool: { dealAddress },
  } = useAelinPool(chainId, poolAddress)

  const [amountToVest, setAmountToVest] = useState<BigNumber>(ZERO_BN)

  const method = isDealTokenTransferable ? 'claimableUnderlyingTokens' : 'claimableTokens'
  const params = isDealTokenTransferable ? [tokenIds] : [address ?? ZERO_ADDRESS]

  const [claimableTokens] = useAelinDealCall(
    chainId,
    dealAddress as string,
    method,
    params as Parameters<AelinDealCombined['functions'][typeof method]>,
    isDealTokenTransferable,
    {
      ...(withinInterval && { refreshInterval: ms('5s') }),
    },
  )

  const fetchClaimableTokens = useCallback(async () => {
    try {
      if (isDealTokenTransferable) {
        setAmountToVest(claimableTokens ?? ZERO_BN)
      } else {
        setAmountToVest(claimableTokens ? claimableTokens[0] : ZERO_BN)
      }
    } catch (error) {
      console.error('Error fetching claimable tokens:', error)
      setAmountToVest(ZERO_BN)
    }
  }, [claimableTokens, isDealTokenTransferable])

  useEffect(() => {
    fetchClaimableTokens()
  }, [fetchClaimableTokens])

  return [amountToVest, fetchClaimableTokens]
}
