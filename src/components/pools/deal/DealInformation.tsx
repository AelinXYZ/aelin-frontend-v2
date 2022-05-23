import styled from 'styled-components'

import { Deadline } from '@/src/components/common/Deadline'
import ExternalLink from '@/src/components/common/ExternalLink'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { WaitingForDeal } from '@/types/aelinPool'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

export const DealInformation: React.FC<{
  pool: ParsedAelinPool
  poolStatusHelper: WaitingForDeal
}> = ({ pool, poolStatusHelper }) => {
  const { chainId, deal, sponsorFee } = pool

  return !deal ? (
    <div>No Deal presented yet.</div>
  ) : (
    <>
      <Column>
        <InfoCell
          title="Name"
          value={
            <ExternalLink
              href={getExplorerUrl(pool.dealAddress || '', chainId)}
              label={deal.name}
            />
          }
        />
        <InfoCell
          title="Deal token"
          tooltip="The token an investor may claim after an optional vesting period if they accept the deal"
          value={
            <ExternalLink
              href={getExplorerUrl(deal.underlyingToken.token, chainId)}
              label={deal.underlyingToken.symbol}
            />
          }
        />
        <InfoCell
          title="Exchange rates"
          tooltip="The ratio at which investment tokens deposited in the pool will be exchanged for deal tokens"
        >
          <Value>{`${deal.exchangeRates.investmentPerDeal.formatted} ${deal.underlyingToken.symbol} per ${pool.investmentTokenSymbol}`}</Value>
          <Value>{`${deal.exchangeRates.dealPerInvestment.formatted} ${pool.investmentTokenSymbol} per ${deal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        <InfoCell
          title="Deal stage"
          tooltip="A series of steps that investors go through from depositing funds to vesting deal tokens. The full list of stages are: Pro Rata Redemption, Open Redemption, Redemption closed"
          value={
            deal.redemption?.stage === 1
              ? 'Round 1: Pro Rata Redemption'
              : deal.redemption?.stage === 2
              ? 'Round 2: Open Redemption'
              : 'Redemption closed'
          }
        />
        <InfoCell
          title="Round 2 deadline"
          tooltip="The open redemption period is for investors who have maxxed their allocation in the pro rata round"
        >
          {deal.redemption && deal.redemption.openRedemptionEnd ? (
            <Deadline
              progress={calculateDeadlineProgress(
                deal.redemption.openRedemptionEnd,
                deal.redemption.start,
              )}
              width="180px"
            >
              <Value>{formatDate(deal.redemption.openRedemptionEnd, DATE_DETAILED)}</Value>
            </Deadline>
          ) : (
            <Value>No open period</Value>
          )}
        </InfoCell>
        <InfoCell title="Pool stats" tooltip="Stats across all investors in the pool">
          <Value>Amount in pool: {pool.amountInPool.formatted}</Value>
          <Value>Total redeem: {pool.redeem.formatted}</Value>
          <Value>Total withdrawn: {pool.withdrawn.formatted}</Value>
        </InfoCell>
      </Column>
      <Column>
        <InfoCell title="Symbol" value={deal.symbol} />
        <InfoCell
          title="Deal token amount"
          tooltip="The total amount of underlying deal tokens in the deal"
          value={`${deal.underlyingToken.dealAmount.formatted} ${deal.underlyingToken.symbol}`}
        />
        <InfoCell
          title="Vesting data"
          tooltip="The time investors need to wait before claiming their deal tokens after the deal is complete"
        >
          <Value>Cliff: {deal.vestingPeriod.cliff.formatted}</Value>
          <Value>Linear period: {deal.vestingPeriod.vesting.formatted}</Value>
        </InfoCell>
        <InfoCell
          title="Round 1 deadline"
          tooltip="The pro rata redemption period is when an investor has the opportunity to max out their allocation for the deal"
          value={
            deal.redemption
              ? formatDate(deal.redemption.proRataRedemptionEnd, DATE_DETAILED)
              : 'N/A'
          }
        />
        <InfoCell title="User stats" tooltip="Pool stats for an investor connected to the app">
          <Value>
            Remaining pro-rata allocation: {poolStatusHelper.userMaxAllocation.formatted}
          </Value>
          <Value>Withdrawn: {poolStatusHelper.userTotalWithdrawn.formatted}</Value>
        </InfoCell>
        <InfoCell
          title="Fees charged on accept"
          tooltip="A 2% protocol fee in addition to a sponsor fee is only charged on deal acceptance"
        >
          <Value>Sponsor Fee: {sponsorFee.formatted}</Value>
          <Value>Aelin protocol fee: 2%</Value>
        </InfoCell>
      </Column>
    </>
  )
}

export default DealInformation
