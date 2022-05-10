import { isAddress } from '@ethersproject/address'

import { genericSuspense } from '../helpers/SafeSuspense'
import { ExternalLink } from '../table/ExternalLink'
import { ChainsValues } from '@/src/constants/chains'
import { useEnsLookUpAddress } from '@/src/hooks/useEnsName'
import { shortenAddress } from '@/src/utils/string'

type Props = {
  address: string
  network: ChainsValues
}

const ENSOrAddress = ({ address, network }: Props) => {
  const { data, explorerUrl } = useEnsLookUpAddress(address, network)

  if (!data) return null

  return (
    <ExternalLink href={explorerUrl}>{isAddress(data) ? shortenAddress(data) : data}</ExternalLink>
  )
}

export default genericSuspense(ENSOrAddress, () => null)
