import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import ms from 'ms'

import AelinDealABI from '@/src/abis/AelinDeal.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'

export const fetchAmountToVest = (
  dealAddress: string,
  chainId: ChainsValues,
  userAddress: string,
) => {
  const provider = new JsonRpcProvider(getNetworkConfig(chainId).rpcUrl)

  return contractCall(dealAddress as string, AelinDealABI, provider, 'claimableTokens', [
    userAddress,
  ]).then(([amountToVest]) => amountToVest)
}

export default function useAelinAmountToVest(poolAddress: string, chainId: ChainsValues) {
  const { address, isAppConnected } = useWeb3Connection()

  const {
    pool: { dealAddress },
  } = useAelinPool(chainId, poolAddress)

  const [amountToVest, setAmountToVest] = useState<BigNumber | null>(null)

  const getAmountToVest = useCallback(async () => {
    if (!isAppConnected) {
      setAmountToVest(ZERO_BN)
      return
    }

    const amountToVest = await fetchAmountToVest(dealAddress as string, chainId, address as string)

    setAmountToVest(amountToVest)
  }, [address, chainId, dealAddress, isAppConnected])

  useEffect(() => {
    getAmountToVest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => getAmountToVest(), ms('5s'))

    return () => clearInterval(intervalId)
  }, [getAmountToVest])

  return amountToVest
}
