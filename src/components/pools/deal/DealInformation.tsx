import styled from 'styled-components'

import { Deadline } from '@/src/components/common/Deadline'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
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
  const { deal } = pool

  return !deal ? (
    <div>No Deal presented yet.</div>
  ) : (
    <>
      <Column>
        <InfoCell title="Name" value={deal.name} />
        <InfoCell title="Deal token" tooltip="??" value={deal.underlyingToken.token} />
        <InfoCell title="Exchange rates" tooltip="??">
          <Value>{`${deal.exchangeRates.investmentPerDeal.formatted} ${deal.underlyingToken.symbol} per ${pool.investmentTokenSymbol}`}</Value>
          <Value>{`${deal.exchangeRates.dealPerInvestment.formatted} ${pool.investmentTokenSymbol} per ${deal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        <InfoCell
          title="Deal stage"
          tooltip="??"
          value={
            deal.proRataRedemption?.stage === 1
              ? 'Round 1: Pro Rata Redemption'
              : deal.proRataRedemption?.stage === 2
              ? 'Round 2: Open Redemption'
              : 'Redemption closed'
          }
        />
        <InfoCell
          title="Round 1 deadline"
          tooltip="??"
          value={formatDate(deal.proRataRedemption!.proRataRedemptionEnd, DATE_DETAILED)}
        />
        <InfoCell title="Pool stats" tooltip="??">
          <Value>Amount in pool: {pool.amountInPool.formatted}</Value>
          <Value>Total redeem: {pool.redeem.formatted}</Value>
          <Value>Total withdrawn: {pool.withdrawn.formatted}</Value>
        </InfoCell>
      </Column>
      <Column>
        <InfoCell title="Symbol" value={deal.symbol} />
        <InfoCell
          title="Deal token amount"
          tooltip="??"
          value={deal.underlyingToken.dealAmount.formatted}
        />
        <InfoCell title="Vesting data" tooltip="??">
          <Value>Cliff: {deal.vesting.cliff.toString()}</Value>
          <Value>Linear period: {deal.vesting.linear.toString()}</Value>
        </InfoCell>
        <InfoCell title="Round 2 deadline" tooltip="??">
          {deal.proRataRedemption?.openRedemptionEnd ? (
            <Deadline progress="75" width="180px">
              <Value>{formatDate(deal.proRataRedemption!.openRedemptionEnd, DATE_DETAILED)}</Value>
            </Deadline>
          ) : (
            <Value>No Open period</Value>
          )}
        </InfoCell>
        <InfoCell title="User stats" tooltip="??">
          <Value>
            Remaining pro-rata allocation: {poolStatusHelper.userProRataAllocation.formatted}
          </Value>
          <Value>Withdrawn: {poolStatusHelper.userTotalWithdrawn.formatted}</Value>
        </InfoCell>
        <InfoCell title="Fees charged on accept" tooltip="??">
          <Value>Sponsor Fee: {pool.sponsorFee.formatted}</Value>
          <Value>Aelin protocol fee: 2%</Value>
        </InfoCell>
      </Column>
    </>
  )
}

export default DealInformation
