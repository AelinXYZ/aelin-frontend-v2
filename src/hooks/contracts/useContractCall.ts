import { Contract, ContractInterface } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import useSWR, { KeyedMutator, SWRConfiguration } from 'swr'

//import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'
import getCacheKey from '@/src/utils/getCacheKey'

export default function useContractCall<
  MyContract extends Contract,
  Method extends keyof MyContract & string,
  Params extends Parameters<MyContract[Method]>,
  Return extends ReturnType<MyContract[Method]>,
>(
  provider: JsonRpcProvider,
  address: string,
  abi: ContractInterface,
  method: Method,
  params: Params | null,
  skip?: Record<any, any> | any[] | false,
  options?: SWRConfiguration,
): [Awaited<Return> | null, KeyedMutator<Return>] {
  const { address: walletAddress } = useWeb3Connection()

  const { data = skip ?? null, mutate: refetch } = useSWR(
    skip ? null : [method, address, JSON.stringify(params), walletAddress],
    async (method, address) => contractCall(address, abi, provider, method, params),
    options,
  )

  return [data, refetch]
}

// TODO: I had to replicate this method because couldn't make that TS infer the
// correct return type.
export function useContractCallMultiple<
  MyContract extends Contract,
  Method extends keyof MyContract & string,
  Params extends Parameters<MyContract[Method]>,
  //Return extends ReturnType<MyContract[Method]>,
>(
  provider: JsonRpcProvider,
  address: string,
  abi: ContractInterface,
  calls: {
    method: Method
    params: Params | null
  }[],
  options?: SWRConfiguration,
): [Awaited<any> | null, KeyedMutator<any>] {
  const { address: walletAddress } = useWeb3Connection()

  const { data, mutate: refetch } = useSWR(
    [address, walletAddress, calls.map((c) => `${c.method}-${getCacheKey(c.params || [])}`)],
    async (address) => {
      const promises = calls.map(async (c) =>
        contractCall(address, abi, provider, c.method, c.params),
      )
      try {
        return await Promise.all(promises)
      } catch (error) {
        return []
      }
    },
    options,
  )

  return [data, refetch]
}
