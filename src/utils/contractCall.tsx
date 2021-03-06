import { Contract, ContractInterface } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

export default async function contractCall<
  MyContract extends Contract,
  Method extends keyof MyContract & string,
>(
  address: string,
  abi: ContractInterface,
  provider: JsonRpcProvider | JsonRpcSigner,
  method: Method,
  params: Parameters<MyContract[Method]> | null,
): Promise<ReturnType<MyContract[Method]> | null> {
  const contract = new Contract(address as string, abi, provider) as MyContract
  try {
    const contractMethod = contract[method]
    const result = Array.isArray(params) ? await contractMethod(...params) : await contractMethod()
    return result
  } catch (e) {
    return null
  }
}
