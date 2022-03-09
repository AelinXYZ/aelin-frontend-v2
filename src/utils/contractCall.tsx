import { Contract, ContractInterface } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'

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
    const deployedContract = await contract.deployed()
    const contractMethod = deployedContract[method]
    let result = Array.isArray(params) ? await contractMethod(...params) : await contractMethod()
    if (result?._isBigNumber) {
      //Convert ethersjs bignumber to bignumber.js
      result = BigNumber.from(result.toString())
    }
    return result
  } catch (e) {
    return null
  }
}
