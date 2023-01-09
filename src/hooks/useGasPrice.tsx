import ms from 'ms'
import useSWR from 'swr'

import { getGasPriceEIP1559, getGasPriceFromProvider } from '../utils/gasUtils'
import { mainnetRpcProvider } from './useEnsResolvers'
import { Chains, chainsConfig } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { GasPrice, GasPrices, GasSpeed } from '@/types/utils'

export const GAS_SPEEDS: GasSpeed[] = ['aggressive', 'market', 'low']

const useEthGasPrice = () => {
  const { appChainId, readOnlyAppProvider } = useWeb3Connection()
  const isL2Chain = chainsConfig[appChainId]?.isL2

  const { data, isValidating } = useSWR<GasPrices, Error>(
    appChainId ? ['network', 'gasPrice', appChainId] : null,
    async () => {
      try {
        const block = await mainnetRpcProvider.getBlock('latest')
        const l2Block = await readOnlyAppProvider.getBlock('latest')
        const l2GasPrice = l2Block?.baseFeePerGas
          ? getGasPriceEIP1559(l2Block.baseFeePerGas, appChainId)
          : await getGasPriceFromProvider(readOnlyAppProvider)
        return {
          l1: block?.baseFeePerGas
            ? getGasPriceEIP1559(block.baseFeePerGas, Chains.mainnet)
            : await getGasPriceFromProvider(mainnetRpcProvider),
          l2: isL2Chain ? l2GasPrice : undefined,
        }
      } catch (e) {
        throw new Error('Cannot retrieve gas price from provider. ' + e)
      }
    },
    {
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshInterval: ms('10s'),
    },
  )

  return { data, isValidating }
}

export const useEthGasPriceLegacy = () => {
  const { appChainId } = useWeb3Connection()

  const { data, isValidating } = useSWR<GasPrice<number>, Error>(
    appChainId ? ['network', 'gasPrice', 'legacy', appChainId] : null,
    async () => {
      try {
        return await getGasPriceFromProvider(mainnetRpcProvider)
      } catch (e) {
        throw new Error('Cannot retrieve gas price from provider. ' + e)
      }
    },
    {
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshInterval: ms('10s'),
    },
  )

  return { data, isValidating }
}

export default useEthGasPrice
