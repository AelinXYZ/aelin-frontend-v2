import styled from 'styled-components'

import { PoolInfoItem, Value } from '@/src/components/pools/PoolInfoItem'
import { Deadline } from '@/src/components/table/Deadline'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

export const PoolInfo: React.FC<{
  pool: ParsedAelinPool
  poolAddress: string
}> = ({ pool }) => {
  return (
    <>
      <Column>
        <PoolInfoItem
          title="Investment token"
          tooltip="Investment token tooltip contents"
          value={pool.investmentTokenSymbol}
        />
        <PoolInfoItem
          title="Pool cap"
          tooltip="Pool cap tooltip"
          value={pool.poolCap.raw.eq(ZERO_BN) ? 'unlimited' : pool.poolCap.formatted}
        />
        <PoolInfoItem title="Pool stats" tooltip="Pool stats tooltip">
          <Value>Funded: {pool.investmentRaisedAmount.formatted}</Value>
          <Value>Withdrawn: {pool.withdrawn.formatted}</Value>
          <Value>Amount in Pool: {pool.amountInPool.formatted}</Value>
        </PoolInfoItem>
        <PoolInfoItem title={`My ${pool.investmentTokenSymbol} balance`} value={'0.00'} />
        <PoolInfoItem title="My pool balance" tooltip="My pool balance tooltip" value={'0.00'} />
      </Column>
      <Column>
        <PoolInfoItem title="Investment deadline" tooltip="Investment deadline tooltip">
          <Deadline progress="75" width="180px">
            <Value>{formatDate(pool.purchaseExpiry, DATE_DETAILED)}</Value>
          </Deadline>
        </PoolInfoItem>
        <PoolInfoItem
          title="Deal deadline"
          tooltip="Deal deadline tooltip"
          value={formatDate(pool.dealDeadline, DATE_DETAILED)}
        />
        <PoolInfoItem title="Sponsor" tooltip="Sponsor tooltip" value={pool.sponsor} />
        <PoolInfoItem
          title="Sponsor fee"
          tooltip="Sponsor fee tooltip"
          value={pool.sponsorFee.formatted}
        />
      </Column>
    </>
  )
}

export default PoolInfo
