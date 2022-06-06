import styled from 'styled-components'

import { DynamicDeadline } from '@/src/components/common/DynamicDeadline'
import ExternalLink from '@/src/components/common/ExternalLink'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import InlineLoading from '@/src/components/pureStyledComponents/common/InlineLoading'
import useAelinDealUserStats from '@/src/hooks/aelin/useAelinDealUserStats'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

const StyledValue = styled(Value)`
  gap: 5px;
`

const UserStatsInfoCell = genericSuspense(
  ({ pool, title, tooltip }: { pool: ParsedAelinPool; title: string; tooltip: string }) => {
    const userStats = useAelinDealUserStats(pool)
    return (
      <InfoCell title={title} tooltip={tooltip}>
        <Value>Remaining pro-rata allocation: {userStats.userMaxAllocation.formatted}</Value>
        <Value>Withdrawn: {userStats.userTotalWithdrawn.formatted}</Value>
        <Value>Accepted: {userStats.totalAmountAccepted.formatted}</Value>
      </InfoCell>
    )
  },
  () => <InlineLoading />,
)

const DealParticipantsInfoCell = genericSuspense(
  ({ pool, title, tooltip }: { pool: ParsedAelinPool; title: string; tooltip: string }) => {
    return (
      <InfoCell title={title} tooltip={tooltip}>
        <Value>Accepted: {pool.deal?.totalUsersAccepted || 0}</Value>
        <Value>Rejected: {pool.deal?.totalUsersRejected || 0}</Value>
      </InfoCell>
    )
  },
  () => <InlineLoading />,
)

export const DealInformation: React.FC<{
  pool: ParsedAelinPool
}> = ({ pool }) => {
  const { chainId, deal, sponsorFee } = pool

  if (!deal) return <div>No Deal presented yet.</div>

  return (
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
          title="Token totals"
          tooltip="The total amount of investment tokens funded and deal tokens available"
        >
          <StyledValue>
            Investment token: {pool.funded.formatted}{' '}
            <ExternalLink
              href={getExplorerUrl(pool.investmentToken, chainId)}
              label={pool.investmentTokenSymbol}
            />
          </StyledValue>
          <StyledValue>
            Deal token: {deal.underlyingToken.dealAmount.formatted}
            <ExternalLink
              href={getExplorerUrl(deal.underlyingToken.token, chainId)}
              label={deal.underlyingToken.symbol}
            />
          </StyledValue>
        </InfoCell>
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
              ? 'Round 1: Accept Allocation'
              : deal.redemption?.stage === 2
              ? 'Round 2: Accept Remaining'
              : 'Redemption closed'
          }
        />
        <InfoCell
          title="Round 2 deadline"
          tooltip="The open redemption period is for investors who have maxxed their allocation in the pro rata round"
        >
          <Value>Accept Remaining</Value>
          {deal.redemption &&
          deal.redemption.proRataRedemptionEnd &&
          deal.redemption.openRedemptionEnd ? (
            <DynamicDeadline
              deadline={deal.redemption.openRedemptionEnd}
              hideWhenDeadlineIsReached={true}
              start={deal.redemption.proRataRedemptionEnd}
              width="180px"
            >
              {deal.redemption
                ? formatDate(deal.redemption.openRedemptionEnd, DATE_DETAILED)
                : 'N/A'}
            </DynamicDeadline>
          ) : (
            <Value>N/A</Value>
          )}
        </InfoCell>
        <InfoCell title="Pool stats" tooltip="Stats across all investors in the pool">
          <Value>Amount in pool: {pool.amountInPool.formatted}</Value>
          <Value>Total redeem: {pool.redeem.formatted}</Value>
          <Value>Total withdrawn: {pool.withdrawn.formatted}</Value>
        </InfoCell>
        <DealParticipantsInfoCell
          pool={pool}
          title="Deal participants"
          tooltip="Total amount of users who accepted or rejected the deal"
        />
      </Column>
      <Column>
        <InfoCell title="Symbol" value={deal.symbol} />
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
        >
          {deal.redemption && deal.redemption.proRataRedemptionEnd && (
            <DynamicDeadline
              deadline={deal.redemption.proRataRedemptionEnd}
              hideWhenDeadlineIsReached={true}
              start={deal.redemption.start}
              width="180px"
            >
              {deal.redemption
                ? formatDate(deal.redemption.proRataRedemptionEnd, DATE_DETAILED)
                : 'N/A'}
            </DynamicDeadline>
          )}
        </InfoCell>
        <UserStatsInfoCell
          pool={pool}
          title="User stats"
          tooltip="Pool stats for an investor connected to the app"
        />
        <InfoCell
          title="Fees charged on accept"
          tooltip="A 2% protocol fee in addition to a sponsor fee is only charged on deal acceptance"
        >
          <Value>Sponsor Fee: {sponsorFee.formatted}</Value>
          <Value>Aelin protocol fee: 2%</Value>
        </InfoCell>
        <InfoCell
          title="Deal tokens sold"
          tooltip="The total amount of deal tokens sold to investors"
        >
          <StyledValue>
            {deal.tokensSold.formatted}{' '}
            <ExternalLink
              href={getExplorerUrl(deal.underlyingToken.token, chainId)}
              label={deal.underlyingToken.symbol}
            />
          </StyledValue>
        </InfoCell>
      </Column>
    </>
  )
}

export default DealInformation
