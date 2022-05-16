import Image from 'next/image'

import { useTokenIcons } from '@/src/providers/tokenIconsProvider'

interface Props {
  symbol: string
}
export const TokenIcon: React.FC<Props> = ({ symbol }) => {
  const { tokens: tokensBySymbol } = useTokenIcons()
  const investmentTokenImage = tokensBySymbol[symbol.toLowerCase()]?.logoURI

  return investmentTokenImage ? (
    <Image alt={symbol} height={18} src={investmentTokenImage} title={symbol} width={18} />
  ) : (
    <>{symbol}</>
  )
}
