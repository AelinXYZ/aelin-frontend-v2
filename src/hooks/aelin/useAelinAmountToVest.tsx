import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import ms from 'ms'

import AelinDealABI from '@/src/abis/AelinDeal.json'
import { ChainsValues, getNetworkConfig } from '@/src/constants/config/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinPool from '@/src/hooks/aelin/useAelinPool'
import useAelinDealCall from '@/src/hooks/contracts/useAelinDealCall'
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

export default function useAelinAmountToVest(
  poolAddress: string,
  chainId: ChainsValues,
  withinInterval: boolean,
): [BigNumber, () => void] {
  const { address } = useWeb3Connection()

  const {
    pool: { dealAddress },
  } = useAelinPool(chainId, poolAddress)

  const [response, refetch] = useAelinDealCall(
    chainId,
    dealAddress as string,
    'claimableTokens',
    [address || ZERO_ADDRESS],
    {
      ...(withinInterval && { refreshInterval: ms('5s') }),
    },
  )

  if (!response) return [ZERO_BN, refetch]

  const [amountToVest] = response

  return [amountToVest, refetch]
}
