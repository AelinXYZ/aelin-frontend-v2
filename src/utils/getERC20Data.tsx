import { Contract } from '@ethersproject/contracts'
import { Provider, getDefaultProvider } from '@ethersproject/providers'

import erc20Abi from '@/src/abis/ERC20.json'

export const getERC20Data = async ({
  address,
  provider,
}: {
  address: string
  provider: Provider | undefined
}) => {
  const contract = new Contract(address, erc20Abi, provider || getDefaultProvider())

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
  ]).catch(() => [])

  return { name, symbol, decimals, totalSupply }
}
