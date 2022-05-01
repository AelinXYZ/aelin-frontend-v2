import styled from 'styled-components'

import { Deadline } from '@/src/components/common/Deadline'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { Funding } from '@/types/aelinPool'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

export const PoolInformation: React.FC<{
  pool: ParsedAelinPool
  poolStatusHelper: Funding
}> = ({ pool, poolStatusHelper }) => {
  return (
    <>
      <Column>
        <InfoCell
          title="Investment token"
          tooltip="Investment token tooltip contents"
          value={pool.investmentTokenSymbol}
        />
        <InfoCell
          title="Pool cap"
          tooltip="Pool cap tooltip"
          value={pool.poolCap.raw.eq(ZERO_BN) ? 'uncapped' : pool.poolCap.formatted}
        />
        <InfoCell title="Pool stats" tooltip="Pool stats tooltip">
          <Value>Funded: {pool.funded.formatted}</Value>
          <Value>Withdrawn: {pool.withdrawn.formatted}</Value>
          <Value>Amount in Pool: {pool.amountInPool.formatted}</Value>
        </InfoCell>
        <InfoCell
          title={`My ${pool.investmentTokenSymbol} balance`}
          value={poolStatusHelper.investmentTokenBalance.formatted}
        />
        <InfoCell
          title="My pool balance"
          tooltip="My pool balance tooltip"
          value={poolStatusHelper.poolTokenBalance.formatted}
        />
      </Column>
      <Column>
        <InfoCell title="Investment deadline" tooltip="Investment deadline tooltip">
          <Deadline progress="75" width="180px">
            <Value>{formatDate(pool.purchaseExpiry, DATE_DETAILED)}</Value>
          </Deadline>
        </InfoCell>
        <InfoCell
          title="Deal deadline"
          tooltip="Deal deadline tooltip"
          value={formatDate(pool.dealDeadline, DATE_DETAILED)}
        />
        <InfoCell title="Sponsor" tooltip="Sponsor tooltip" value={pool.sponsor} />
        <InfoCell
          title="Sponsor fee"
          tooltip="Sponsor fee tooltip"
          value={pool.sponsorFee.formatted}
        />
      </Column>
    </>
  )
}

export default PoolInformation
