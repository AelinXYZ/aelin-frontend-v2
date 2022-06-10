import ms from 'ms'
import useSWR from 'swr'

import { getGasPriceEIP1559, getGasPriceFromProvider } from '../utils/gasUtils'
import { mainnetRpcProvider } from './useEnsResolvers'
import { chainsConfig } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { GasPrices, GasSpeed } from '@/types/utils'

export const GAS_SPEEDS: GasSpeed[] = ['average', 'fast', 'fastest']

const useEthGasPrice = () => {
  const { appChainId, readOnlyAppProvider } = useWeb3Connection()
  const isL2Chain = chainsConfig[appChainId]?.isL2

  const { data, isValidating } = useSWR<GasPrices, Error>(
    appChainId ? ['network', 'gasPrice', appChainId] : null,
    async () => {
      try {
        const block = await mainnetRpcProvider.getBlock('latest')
        return {
          l1: block?.baseFeePerGas
            ? getGasPriceEIP1559(block.baseFeePerGas)
            : await getGasPriceFromProvider(mainnetRpcProvider),
          l2: isL2Chain ? await getGasPriceFromProvider(readOnlyAppProvider) : undefined,
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

export default useEthGasPrice
