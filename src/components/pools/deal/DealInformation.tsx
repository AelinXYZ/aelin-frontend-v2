import styled from 'styled-components'

import { InfoCell } from '@/src/components/pools/common/InfoCell'
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
  if (!pool.deal) {
    return <div>No Deal presented yet.</div>
  }

  const deal = pool.deal
  return (
    <>
      <Column>
        <InfoCell title="Name" value={`${deal.name} - ${pool.dealAddress}`} />
        <InfoCell title="Deal token" tooltip="??" value={deal.underlyingToken.token} />
        <InfoCell
          title="Exchange rates"
          tooltip="??"
          value={
            <>
              <div>{`${pool.deal.exchangeRates.investmentPerDeal.formatted} ${pool.deal.underlyingToken.symbol}  per ${pool.investmentTokenSymbol}`}</div>
              <div>{`${pool.deal.exchangeRates.dealPerInvestment.formatted} ${pool.investmentTokenSymbol}  per ${pool.deal.underlyingToken.symbol}`}</div>
            </>
          }
        />
        <InfoCell
          title="Deal stage"
          tooltip="??"
          value={
            pool.deal.redemption?.stage === 1
              ? 'Round 1: Pro Rata Redemption'
              : pool.deal.redemption?.stage === 2
              ? 'Round 2: Open Redemption'
              : 'Redemption closed'
          }
        />
        <InfoCell
          title="Round 1 deadline"
          tooltip="??"
          //value={formatDate(pool.deal.redemption!.proRataRedemptionEnd, DATE_DETAILED)}
          value="asd"
        />
        <InfoCell
          title="Pool stats"
          tooltip="??"
          value={
            <>
              <div>Amount in pool: {pool.amountInPool.formatted}</div>
              <div>Total redeem: {pool.redeem.formatted}</div>
              <div>Total withdrawn: {pool.withdrawn.formatted}</div>
            </>
          }
        />
      </Column>
      <Column>
        <InfoCell title="Symbol" value={deal.symbol} />
        <InfoCell
          title="Deal token amount"
          tooltip="??"
          value={deal.underlyingToken.dealAmount.formatted}
        />
        <InfoCell
          title="Vesting data"
          tooltip="??"
          value={
            <>
              <div>Cliff: {pool.deal.vesting.cliff.toString()}</div>
              <div>Linear period: {pool.deal.vesting.linear.toString()}</div>
            </>
          }
        />
        <InfoCell
          title="Round 2 deadline"
          tooltip="??"
          value={
            pool.deal.redemption?.openRedemptionEnd
              ? formatDate(pool.deal.redemption!.openRedemptionEnd, DATE_DETAILED)
              : ' - No Open period'
          }
        />
        <InfoCell
          title="User stats"
          tooltip="??"
          value={
            <div>
              <div>
                Remaining pro-rata allocation: {poolStatusHelper.userProRataAllocation.formatted}
              </div>
              <div>Withdrawn: {poolStatusHelper.userTotalWithdrawn.formatted}</div>
            </div>
          }
        />
        <InfoCell
          title="Fees charged on accept"
          tooltip="??"
          value={
            <div>
              <div>Sponsor Fee: {pool.sponsorFee.formatted}</div>
              <div>Aelin protocol fee: 2%</div>
            </div>
          }
        />
      </Column>
    </>
  )
}

export default DealInformation
