import { getAddress } from '@ethersproject/address'

import { truncateStringInTheMiddle } from '@/src/utils/tools'

type Props = {
  address: string
}

export default function ENSOrAddress({ address }: Props) {
  const _address = getAddress(address)

  return <>{truncateStringInTheMiddle(_address, 6, 6)}</>
}
