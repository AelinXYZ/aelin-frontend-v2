import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import InlineLoading from '@/src/components/pureStyledComponents/common/InlineLoading'
import { CellProps } from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink as Wrapper } from '@/src/components/table/ExternalLink'
import { ChainsValues } from '@/src/constants/chains'
import { isValidENSName, useEnsLookUpAddress, useEnsResolver } from '@/src/hooks/useEnsResolvers'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { shortenAddress } from '@/src/utils/string'

const Content = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface Props extends CellProps {
  address: string
  network?: ChainsValues
}

const AddressToENS = ({ address, network }: Props) => {
  const { appChainId } = useWeb3Connection()
  const { data } = useEnsLookUpAddress(address)

  if (!data) return null

  return (
    <Wrapper href={getExplorerUrl(address, network ?? appChainId)}>
      <Content>{isAddress(data) ? shortenAddress(data) : data}</Content>
    </Wrapper>
  )
}

const ENStoAddress = ({ address, network }: Props) => {
  const { appChainId } = useWeb3Connection()
  const { data } = useEnsResolver(address)

  if (!data) return null

  return (
    <Wrapper href={getExplorerUrl(data, network ?? appChainId)}>
      <Content>{address}</Content>
    </Wrapper>
  )
}

const ENSOrAddress = ({ address, network }: Props) => {
  if (isValidENSName(address)) {
    return <ENStoAddress address={address} network={network} />
  }

  return <AddressToENS address={address} network={network} />
}

export default genericSuspense(ENSOrAddress, () => <InlineLoading />)
