import { isAddress } from '@ethersproject/address'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import InlineLoading from '@/src/components/pureStyledComponents/common/InlineLoading'
import { CellProps } from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink as Wrapper } from '@/src/components/table/ExternalLink'
import { ChainsValues } from '@/src/constants/chains'
import { useEnsLookUpAddress } from '@/src/hooks/useEnsResolvers'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { shortenAddress } from '@/src/utils/string'

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

export default genericSuspense(ENSOrAddress, () => <InlineLoading />)
