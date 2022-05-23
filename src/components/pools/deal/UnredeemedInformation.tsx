import styled from 'styled-components'

import ExternalLink from '@/src/components/common/ExternalLink'
import { InfoCell } from '@/src/components/pools/common/InfoCell'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

export const UnredeemedInformation: React.FC<{
  pool: ParsedAelinPool
}> = ({ pool }) => {
  const { deal } = pool

  return !deal ? (
    <div>No Deal presented yet.</div>
  ) : (
    <>
      <Column>
        <InfoCell
          title="Token to withdraw"
          tooltip="Deal tokens that have been rejected by the purchasers"
          value={
            <ExternalLink
              href={getExplorerUrl(deal.underlyingToken.token || '', pool.chainId)}
              label={deal.underlyingToken.symbol}
            />
          }
        />
      </Column>
      <Column>
        <InfoCell
          title="Amount to withdraw"
          value={`${deal.unredeemed.formatted} ${deal.underlyingToken.symbol}`}
        />
      </Column>
    </>
  )
}

export default UnredeemedInformation
