import { Contract, ContractInterface } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import useSWR, { KeyedMutator, SWRConfiguration } from 'swr'

//import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import contractCall from '@/src/utils/contractCall'

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
