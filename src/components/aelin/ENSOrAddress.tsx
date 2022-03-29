import { getAddress } from '@ethersproject/address'

import { shortenAddr } from '@/src/web3/utils'

type Props = {
  address: string
}

export default function ENSOrAddress({ address }: Props) {
  const _address = getAddress(address)

  return <span>{shortenAddr(_address)}</span>
}
