import styled, { keyframes } from 'styled-components'

import { isAddress } from '@ethersproject/address'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { ChainsValues } from '@/src/constants/chains'
import { useEnsLookUpAddress } from '@/src/hooks/useEnsName'
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

const ENSOrAddress: React.FC<{
  address: string
  network: ChainsValues
}> = ({ address, network, ...restProps }) => {
  const { data, explorerUrl } = useEnsLookUpAddress(address, network)

  return data ? (
    <ExternalLink {...restProps} href={explorerUrl}>
      {isAddress(data) ? shortenAddress(data) : data}
    </ExternalLink>
  ) : null
}

export default genericSuspense(ENSOrAddress, () => <Loading>Loading...</Loading>)
