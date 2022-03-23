import { ethers } from 'ethers'

import { shortenAddr } from '@/src/web3/utils'

type Props = {
  address: string
}

export default function ENSOrAddress({ address }: Props) {
  const _address = ethers.utils.getAddress(address)

  return <span>{shortenAddr(_address)}</span>
}
