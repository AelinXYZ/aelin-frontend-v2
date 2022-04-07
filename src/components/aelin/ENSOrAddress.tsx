import { getAddress } from '@ethersproject/address'

import { shortenAddress } from '@/src/utils/string'

type Props = {
  address: string
}

export default function ENSOrAddress({ address }: Props) {
  const _address = getAddress(address)

  return <>{shortenAddress(_address)}</>
}
