import { BigNumber } from '@ethersproject/bignumber'
import { wei } from '@synthetixio/wei'
import ms from 'ms'
import useSWR from 'swr'

import { Chains } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import formatGwei from '@/src/utils/formatGwai'
import { GasPrices, GasSpeed } from '@/types/utils'

export const GAS_SPEEDS: GasSpeed[] = ['average', 'fast', 'fastest']

const useEthGasPrice = () => {
  const { appChainId, readOnlyAppProvider } = useWeb3Connection()
  const MULTIPLIER = wei(2)

  const getGasPriceFromProvider = async () => {
    const gasPrice = formatGwei((await readOnlyAppProvider.getGasPrice()).toNumber())

    return {
      fastest: gasPrice,
      fast: gasPrice,
      average: gasPrice,
    }
  }

  const computeGasFee = (baseFeePerGas: BigNumber, maxPriorityFeePerGas: number) =>
    wei(baseFeePerGas, 9).mul(MULTIPLIER).add(wei(maxPriorityFeePerGas, 9)).toNumber()

  const { data, isValidating } = useSWR<GasPrices, Error>(
    appChainId ? ['network', 'gasPrice', appChainId] : null,
    async () => {
      try {
        if (appChainId === Chains.mainnet) {
          const block = await readOnlyAppProvider.getBlock('latest')
          if (!block?.baseFeePerGas) {
            return await getGasPriceFromProvider()
          }
          return {
            fastest: computeGasFee(block.baseFeePerGas, 6),
            fast: computeGasFee(block.baseFeePerGas, 4),
            average: computeGasFee(block.baseFeePerGas, 2),
          }
        }
        return await getGasPriceFromProvider()
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
