import styled from 'styled-components'

import { Deadline } from '@/src/components/common/Deadline'
import ExternalLink from '@/src/components/common/ExternalLink'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
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
  const { deal, sponsorFee } = pool
  const { getExplorerUrl } = useWeb3Connection()

  return !deal ? (
    <div>No Deal presented yet.</div>
  ) : (
    <>
      <Column>
        <InfoCell
          title="Name"
          value={<ExternalLink href={getExplorerUrl(pool.dealAddress || '')} label={deal.name} />}
        />
        <InfoCell
          title="Deal token"
          tooltip="??"
          value={
            <ExternalLink
              href={getExplorerUrl(deal.underlyingToken.token)}
              label={deal.underlyingToken.symbol}
            />
          }
        />
        <InfoCell title="Exchange rates" tooltip="??">
          <Value>{`${deal.exchangeRates.investmentPerDeal.formatted} ${deal.underlyingToken.symbol} per ${pool.investmentTokenSymbol}`}</Value>
          <Value>{`${deal.exchangeRates.dealPerInvestment.formatted} ${pool.investmentTokenSymbol} per ${deal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        <InfoCell
          title="Deal stage"
          tooltip="??"
          value={
            deal.redemption?.stage === 1
              ? 'Round 1: Pro Rata Redemption'
              : deal.redemption?.stage === 2
              ? 'Round 2: Open Redemption'
              : 'Redemption closed'
          }
        />
        <InfoCell
          title="Round 1 deadline"
          tooltip="??"
          value={
            deal.redemption
              ? formatDate(deal.redemption.proRataRedemptionEnd, DATE_DETAILED)
              : 'N/A'
          }
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
          value={`${deal.underlyingToken.dealAmount.formatted} ${deal.underlyingToken.symbol}`}
        />
        <InfoCell title="Vesting data" tooltip="??">
          <Value>Cliff: {deal.vestingPeriod.cliff.formatted}</Value>
          <Value>Linear period: {deal.vestingPeriod.vesting.formatted}</Value>
        </InfoCell>
        <InfoCell title="Round 2 deadline" tooltip="??">
          {deal.redemption && deal.redemption.openRedemptionEnd ? (
            <Deadline progress="75" width="180px">
              <Value>{formatDate(deal.redemption.openRedemptionEnd, DATE_DETAILED)}</Value>
            </Deadline>
          ) : (
            <Value>No open period</Value>
          )}
        </InfoCell>
        <InfoCell title="User stats" tooltip="??">
          <Value>
            Remaining pro-rata allocation: {poolStatusHelper.userProRataAllocation.formatted}
          </Value>
          <Value>Withdrawn: {poolStatusHelper.userTotalWithdrawn.formatted}</Value>
        </InfoCell>
        <InfoCell title="Fees charged on accept" tooltip="??">
          <Value>Sponsor Fee: {sponsorFee.formatted}</Value>
          <Value>Aelin protocol fee: 2%</Value>
        </InfoCell>
      </Column>
    </>
  )
}

export default DealInformation
