import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import InlineLoading from '@/src/components/pureStyledComponents/common/InlineLoading'
import { CellProps } from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink as Wrapper } from '@/src/components/table/ExternalLink'
import { ChainsValues } from '@/src/constants/chains'
import { useEnsLookUpAddress } from '@/src/hooks/useEnsResolvers'
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

const ENSOrAddress: React.FC<Props> = ({ address, network }) => {
  const { data } = useEnsLookUpAddress(address)
  const { appChainId } = useWeb3Connection()

  return data ? (
    <Wrapper href={getExplorerUrl(address, network ?? appChainId)}>
      <Content>{isAddress(data) ? shortenAddress(data) : data}</Content>
    </Wrapper>
  ) : null
}

export default genericSuspense(ENSOrAddress, () => <InlineLoading />)
