import styled from 'styled-components'

import { Deadline } from '@/src/components/common/Deadline'
import ExternalLink from '@/src/components/common/ExternalLink'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

export const VestingInformation: React.FC<{
  pool: ParsedAelinPool
}> = ({ pool }) => {
  const { deal } = pool

  return !deal ? (
    <div>No Deal presented yet.</div>
  ) : (
    <>
      <Column>
        <InfoCell
          title="Name"
          value={
            <ExternalLink
              href={getExplorerUrl(pool.dealAddress || '', pool.chainId)}
              label={deal.name}
            />
          }
        />
        <InfoCell
          title="Deal token"
          tooltip="??"
          value={
            <ExternalLink
              href={getExplorerUrl(deal.underlyingToken.token, pool.chainId)}
              label={deal.underlyingToken.symbol}
            />
          }
        />

        <InfoCell
          title="Vesting cliff ends"
          tooltip="??"
          value={
            pool.deal?.redemption?.end && pool.deal?.vestingPeriod.cliff.end ? (
              <Deadline
                progress={calculateDeadlineProgress(
                  pool.deal?.vestingPeriod.cliff.end,
                  pool.deal?.redemption?.end,
                )}
                width="180px"
              >
                <Value>{formatDate(pool.deal?.vestingPeriod.cliff.end, DATE_DETAILED)}</Value>
              </Deadline>
            ) : (
              'N/A'
            )
          }
        />
      </Column>
      <Column>
        <InfoCell title="Symbol" value={deal.symbol} />
        <InfoCell
          title="Deal token amount"
          tooltip="??"
          value={`${deal.underlyingToken.dealAmount.formatted} ${deal.underlyingToken.symbol}`}
        />
        <InfoCell
          title="Vesting period ends"
          tooltip="??"
          value={
            pool.deal?.vestingPeriod.cliff.end && pool.deal?.vestingPeriod.vesting.end ? (
              <Deadline
                progress={calculateDeadlineProgress(
                  pool.deal?.vestingPeriod.vesting.end,
                  pool.deal?.vestingPeriod.cliff.end,
                )}
                width="180px"
              >
                <Value>{formatDate(pool.deal?.vestingPeriod.vesting.end, DATE_DETAILED)}</Value>
              </Deadline>
            ) : (
              'N/A'
            )
          }
        ></InfoCell>
      </Column>
    </>
  )
}

export default VestingInformation
