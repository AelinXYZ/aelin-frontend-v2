import Wei, { wei } from '@synthetixio/wei'
import ms from 'ms'
import useSWR from 'swr'

import { mainnetRpcProvider } from './useEnsResolvers'
import { Chains } from '../constants/chains'
import chainlinkAggregatorABI from '@/src/abis/ChainlinkAggregator.json'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'

const aggregatorAddressETH = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
const aggregatorAddressMatic = '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676'

export enum GasPriceUnit {
  eth,
  matic,
}

const useGasPriceUnitInUSD = () => {
  const { appChainId } = useWeb3Connection()

  return useSWR<Wei>(
    ['rates', 'gasPrice', appChainId],
    async () => {
      const aggregatorAddress =
        appChainId === Chains.polygon ? aggregatorAddressMatic : aggregatorAddressETH
      const rate = await contractCall(
        aggregatorAddress as string,
        chainlinkAggregatorABI,
        mainnetRpcProvider,
        'latestAnswer',
        [],
      )
      return wei(rate, 8)
    },
    {
      refreshInterval: ms('2m'),
      suspense: false,
    },
  )
}

export default useGasPriceUnitInUSD
