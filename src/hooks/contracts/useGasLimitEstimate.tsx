import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ContractInterface } from '@ethersproject/contracts'
import Wei from '@synthetixio/wei'

import { ZERO_BN } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'

export default function useGasLimitEstimate(address: string, abi: ContractInterface) {
  const { readOnlyAppProvider } = useWeb3Connection()
  const [gasPrice, setGasPrice] = useState<Wei>(new Wei(0))

  return useCallback(
    async (method, params) => {
      try {
        const estimateGas: BigNumber = await contractCall(
          address,
          abi,
          readOnlyAppProvider,
          method,
          params,
          true,
        )
        return estimateGas
      } catch (e) {
        return ZERO_BN
      }
    },
    [abi, address, readOnlyAppProvider],
  )
}
