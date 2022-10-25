import styled from 'styled-components'

import { DynamicDeadline } from '@/src/components/common/DynamicDeadline'
import ExternalLink from '@/src/components/common/ExternalLink'
import { InfoCell } from '@/src/components/pools/common/InfoCell'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { parseDealName } from '@/src/utils/parsePoolName'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

export const VestingInformation: React.FC<{
  pool: ParsedAelinPool
}> = ({ pool }) => {
  const { deal, upfrontDeal } = pool

  return !deal && !upfrontDeal ? (
    <div>No Deal presented yet.</div>
  ) : upfrontDeal ? (
    <UpfrontDealVestingInfo pool={pool} />
  ) : (
    <SponsorDealVestingInfo pool={pool} />
  )
}

function SponsorDealVestingInfo({ pool }: { pool: ParsedAelinPool }) {
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
              label={parseDealName(deal.name)}
            />
          }
        />
        <InfoCell
          title="Deal token"
          tooltip="The token an investor may claim after an optional vesting period if they accept the deal"
          value={
            <ExternalLink
              href={getExplorerUrl(deal.underlyingToken.token, pool.chainId)}
              label={deal.underlyingToken.symbol}
            />
          }
        />

        <InfoCell
          title="Vesting cliff ends"
          tooltip="After the deal has been finalized, a period where no tokens are vesting"
          value={
            pool.deal?.redemption?.end && pool.deal?.vestingPeriod.cliff.end ? (
              <DynamicDeadline
                deadline={pool.deal?.vestingPeriod.cliff.end}
                hideWhenDeadlineIsReached={true}
                start={pool.deal?.redemption?.end}
                width="180px"
              >
                {formatDate(pool.deal?.vestingPeriod.cliff.end, DATE_DETAILED)}
              </DynamicDeadline>
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
          tooltip="The total amount of deal tokens in the deal"
          value={`${deal.underlyingToken.dealAmount.formatted} ${deal.underlyingToken.symbol}`}
        />
        <InfoCell
          title="Vesting period ends"
          tooltip="The amount of time it takes to vest all deal tokens after the vesting cliff"
          value={
            pool.deal?.vestingPeriod.cliff.end && pool.deal?.vestingPeriod.vesting.end ? (
              <DynamicDeadline
                deadline={pool.deal?.vestingPeriod.vesting.end}
                hideWhenDeadlineIsReached={true}
                start={pool.deal?.vestingPeriod.cliff.end}
                width="180px"
              >
                {formatDate(pool.deal?.vestingPeriod.vesting.end, DATE_DETAILED)}
              </DynamicDeadline>
            ) : (
              'N/A'
            )
          }
        ></InfoCell>
      </Column>
    </>
  )
}

function UpfrontDealVestingInfo({ pool }: { pool: ParsedAelinPool }) {
  const { upfrontDeal } = pool
  return !upfrontDeal ? (
    <div>No Deal presented yet.</div>
  ) : (
    <>
      <Column>
        <InfoCell
          title="Name"
          value={
            <ExternalLink
              href={getExplorerUrl(pool.dealAddress || '', pool.chainId)}
              label={parseDealName(upfrontDeal.name)}
            />
          }
        />
        <InfoCell
          title="Deal token"
          tooltip="The token an investor may claim after an optional vesting period if they accept the deal"
          value={
            <ExternalLink
              href={getExplorerUrl(upfrontDeal.underlyingToken.token, pool.chainId)}
              label={upfrontDeal.underlyingToken.symbol}
            />
          }
        />

        <InfoCell
          title="Vesting cliff ends"
          tooltip="After the deal has been finalized, a period where no tokens are vesting"
          value={
            upfrontDeal.vestingPeriod.cliff.end && upfrontDeal.dealStart ? (
              <DynamicDeadline
                deadline={upfrontDeal.vestingPeriod.cliff.end}
                hideWhenDeadlineIsReached={true}
                start={upfrontDeal.dealStart}
                width="180px"
              >
                {formatDate(upfrontDeal.vestingPeriod.cliff.end, DATE_DETAILED)}
              </DynamicDeadline>
            ) : (
              'N/A'
            )
          }
        />
      </Column>
      <Column>
        <InfoCell title="Symbol" value={upfrontDeal.symbol} />
        <InfoCell
          title="Deal token amount"
          tooltip="The total amount of deal tokens in the deal"
          value={`${upfrontDeal.underlyingToken.dealAmount.formatted} ${upfrontDeal.underlyingToken.symbol}`}
        />
        <InfoCell
          title="Vesting period ends"
          tooltip="The amount of time it takes to vest all deal tokens after the vesting cliff"
          value={
            upfrontDeal.vestingPeriod.cliff.end && upfrontDeal.vestingPeriod.vesting.end ? (
              <DynamicDeadline
                deadline={upfrontDeal.vestingPeriod.vesting.end}
                hideWhenDeadlineIsReached={true}
                start={upfrontDeal.vestingPeriod.cliff.end}
                width="180px"
              >
                {formatDate(upfrontDeal.vestingPeriod.vesting.end, DATE_DETAILED)}
              </DynamicDeadline>
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
