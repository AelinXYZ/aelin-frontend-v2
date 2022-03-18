import { Contract, ContractInterface } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import useSWR, { KeyedMutator, SWRConfiguration } from 'swr'

//import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
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
  options?: SWRConfiguration,
): [Awaited<Return> | null, KeyedMutator<Return>] {
  // commented, in this project is not posib
  // const { isAppConnected, readOnlyAppProvider, web3Provider } = useWeb3Connection()
  // const provider = isAppConnected && web3Provider ? web3Provider.getSigner() : readOnlyAppProvider

  const { data = null, mutate: refetch } = useSWR(
    [method, address, JSON.stringify(params)],
    async (method, address) => contractCall(address, abi, provider, method, params),
    options,
  )

  return [data, refetch]
}
