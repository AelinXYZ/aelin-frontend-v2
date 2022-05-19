import Image from 'next/image'
import styled, { css } from 'styled-components'

import { ExternalLink as BaseExternalLink } from '@/src/components/table/ExternalLink'
import { ChainsValues } from '@/src/constants/chains'
import { useTokenIcons } from '@/src/providers/tokenIconsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'

type Direction = 'column' | 'row'

const Wrapper = styled.div<{ direction?: Direction }>`
  align-items: center;
  column-gap: 6px;
  display: flex;
  flex-direction: ${({ direction }) => direction};
  font-size: 13px;
  justify-content: center;
  row-gap: 3px;
  text-align: center;
`

Wrapper.defaultProps = {
  direction: 'row',
}

const ExternalLink = styled(BaseExternalLink)<{ direction?: Direction }>`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: ${({ direction }) => (direction === 'row' ? 'inherit' : '1rem')};
  gap: 6px;

  ${({ direction }) =>
    direction === 'column' &&
    css`
      > svg {
    height: 8px;
  width: 8px;
      margin-top: -1px;
    `}};

`

ExternalLink.defaultProps = {
  direction: 'row',
}

interface Props {
  address: string
  network: ChainsValues
  symbol: string
  type?: Direction
}

export const TokenIcon: React.FC<Props> = ({ address, network, symbol, type = 'column' }) => {
  const { tokens: tokensBySymbol } = useTokenIcons()
  const investmentTokenImage = tokensBySymbol[symbol.toLowerCase()]?.logoURI

  return investmentTokenImage ? (
    <Wrapper direction={type}>
      <Image alt={symbol} height={18} src={investmentTokenImage} title={symbol} width={18} />
      <ExternalLink direction={type} href={getExplorerUrl(address, network)}>
        {symbol}
      </ExternalLink>
    </Wrapper>
  ) : (
    <>
      <ExternalLink href={getExplorerUrl(address, network)}>{symbol}</ExternalLink>
    </>
  )
}
