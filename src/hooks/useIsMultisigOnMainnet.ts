import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import useSWR from 'swr'

import MULTISIG_ABI from '@/src/abis/GnosisMultisigWallet.json'
import { Chains, getNetworkConfig } from '@/src/constants/chains'

const { rpcUrl: mainnetRpcUrl } = getNetworkConfig(Chains.mainnet)
export const mainnetRpcProvider = new JsonRpcProvider(mainnetRpcUrl)

const fetcher = async (address: string) => {
  try {
    const contract = new Contract(address, MULTISIG_ABI, mainnetRpcProvider)

    // getThreshold() and getOwners() are public functions on the gnosis multisig contracts
    // Ref: https://github.com/safe-global/safe-contracts/blob/main/contracts/base/OwnerManager.sol
    const [threshold, owners] = await Promise.all([contract.getThreshold(), contract.getOwners()])

    return { isMultisig: threshold > 0 && owners.length > 0, error: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // Check if the error is caused by a non-multisig address
    if (err.code === 'CALL_EXCEPTION' && err.message.includes('revert exception')) {
      return { isMultisig: false, error: null }
    }

    return { isMultisig: false, error: err.message || 'Error checking multisig wallet' }
  }
}

const useIsMultisigOnMainnet = (address: string) => {
  const shouldFetch = isAddress(address)
  const { data, error, isValidating } = useSWR(shouldFetch ? address : null, fetcher)

  return {
    data,
    error,
    isValidating,
  }
}

export default useIsMultisigOnMainnet
