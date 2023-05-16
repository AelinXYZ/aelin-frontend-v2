import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import ms from 'ms'

import AelinUpfrontDealABI from '@/src/abis/AelinUpfrontDeal.json'
import AelinUpfrontDealV1ABI from '@/src/abis/AelinUpfrontDeal_v1.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import useAelinUpfrontDealCall, {
  AelinUpfrontDealCombined,
} from '@/src/hooks/contracts/useAelinUpfrontDealCall'
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
      AelinUpfrontDealV1ABI,
      provider,
      'claimableUnderlyingTokens',
      [tokenIds],
    )
  } else {
    return contractCall(
      dealAddress as string,
      AelinUpfrontDealABI,
      provider,
      'claimableUnderlyingTokens',
      [userAddress],
    )
  }
}

export default function useAelinAmountToVestUpfrontDeal(
  isDealTokenTransferable: boolean,
  tokenIds: number[],
  poolAddress: string,
  chainId: ChainsValues,
  withinInterval: boolean,
): [BigNumber, () => void] {
  const { address } = useWeb3Connection()
  const {
    pool: { upfrontDeal },
  } = useAelinPool(chainId, poolAddress)

  const [amountToVest, setAmountToVest] = useState<BigNumber>(ZERO_BN)

  const method = isDealTokenTransferable ? 'claimableUnderlyingTokens' : 'claimableTokens'
  const params = isDealTokenTransferable ? [tokenIds] : [address ?? ZERO_ADDRESS]

  const [claimableTokens] = useAelinUpfrontDealCall(
    chainId,
    upfrontDeal?.address as string,
    'claimableUnderlyingTokens',
    params as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
    isDealTokenTransferable,
    {
      ...(withinInterval && { refreshInterval: ms('5s') }),
    },
  )

  const fetchClaimableTokens = useCallback(async () => {
    try {
      setAmountToVest(claimableTokens ?? ZERO_BN)
    } catch (error) {
      console.error('Error fetching claimable tokens:', error)
      setAmountToVest(ZERO_BN)
    }
  }, [claimableTokens])

  useEffect(() => {
    fetchClaimableTokens()
  }, [fetchClaimableTokens])

  return [amountToVest, fetchClaimableTokens]
}
