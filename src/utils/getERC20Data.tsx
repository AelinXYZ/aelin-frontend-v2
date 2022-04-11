import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { Provider } from '@ethersproject/providers'

import erc20Abi from '@/src/abis/ERC20.json'
import { Token } from '@/src/constants/token'

export const getERC20Data = async ({
  address,
  provider,
}: {
  address: string
  provider: Provider
}): Promise<Token | null> => {
  if (!isAddress(address)) {
    console.log('Invalid ERC20 address to get information')
    return null
  }
  if (!provider) {
    console.log('No web3 provider detected')
    return null
  }
  const contract = new Contract(address, erc20Abi, provider)

  const [name, symbol, decimals, totalSupply, network] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
    provider.getNetwork(),
  ]).catch(() => [])

  if (
    typeof name === 'string' &&
    typeof symbol === 'string' &&
    typeof decimals === 'number' &&
    totalSupply !== undefined
  ) {
    return {
      address,
      symbol,
      name,
      decimals,
      chainId: network.chainId,
    }
  }

  return null
}
