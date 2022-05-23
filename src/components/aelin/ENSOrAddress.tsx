import styled, { keyframes } from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { CellProps } from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink as Wrapper } from '@/src/components/table/ExternalLink'
import { ChainsValues } from '@/src/constants/chains'
import { useEnsLookUpAddress } from '@/src/hooks/useEnsResolvers'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { shortenAddress } from '@/src/utils/string'

const loadingAnimation = keyframes`
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
`

const Loading = styled.div`
  animation-delay: 0;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: ${loadingAnimation};
  animation-timing-function: ease-in-out;
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
`

interface Props extends CellProps {
  address: string
  network: ChainsValues
}

export const ENSOrAddress: React.FC<Props> = ({ address, network, ...restProps }) => {
  const { data } = useEnsLookUpAddress(address)

  return data ? (
    <Wrapper {...restProps} href={getExplorerUrl(address, network)}>
      {isAddress(data) ? shortenAddress(data) : data}
    </Wrapper>
  ) : null
}

export default genericSuspense(ENSOrAddress, () => <Loading>Loading...</Loading>)
