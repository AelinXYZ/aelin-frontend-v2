import Image from 'next/image'
import styled from 'styled-components'

import { ExternalLink } from '@/src/components/table/ExternalLink'
import { ChainsValues } from '@/src/constants/chains'
import { useTokenIcons } from '@/src/providers/tokenIconsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const TokenIconWrapper = styled.div<{
  direction: 'column' | 'row'
}>`
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: ${({ direction }) => direction};
  font-size: 13px;

  > :last-child {
    padding-left: ${({ direction }) => (direction === 'row' ? '10px' : 0)};
    padding-top: ${({ direction }) => (direction === 'column' ? '3px' : 0)};
  }
`
interface Props {
  symbol: string
  address: string
  network: ChainsValues
  type: 'column' | 'row'
}
export const TokenIcon: React.FC<Props> = ({ address, network, symbol, type }) => {
  const { tokens: tokensBySymbol } = useTokenIcons()
  const { getExplorerUrl } = useWeb3Connection()
  const investmentTokenImage = tokensBySymbol[symbol.toLowerCase()]?.logoURI

  return investmentTokenImage ? (
    <TokenIconWrapper direction={type}>
      <Image alt={symbol} height={18} src={investmentTokenImage} title={symbol} width={18} />
      <ExternalLink href={getExplorerUrl(address, network)}>{symbol}</ExternalLink>
    </TokenIconWrapper>
  ) : (
    <>
      <ExternalLink href={getExplorerUrl(address, network)}>{symbol}</ExternalLink>
    </>
  )
}
