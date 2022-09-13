import styled from 'styled-components'

import { TokenIcon } from '../common/TokenIcon'
import { DynamicDeadline } from '@/src/components/common/DynamicDeadline'
import ExternalLink from '@/src/components/common/ExternalLink'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import InlineLoading from '@/src/components/pureStyledComponents/common/InlineLoading'
import useAelinDealUserStats from '@/src/hooks/aelin/useAelinDealUserStats'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { parseDealName } from '@/src/utils/parsePoolName'
import { Funding } from '@/types/aelinPool'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

const StyledValue = styled(Value)`
  gap: 5px;
`

const Warning = styled(Value)`
  color: ${({ theme }) => theme.colors.error};
`

const UserStatsInfoCell = genericSuspense(
  ({ pool, title, tooltip }: { pool: ParsedAelinPool; title: string; tooltip: string }) => {
    const userStats = useAelinDealUserStats(pool)
    return (
      <InfoCell title={title} tooltip={tooltip}>
        <Value>Remaining pro-rata allocation: {userStats.userMaxAllocation.formatted}</Value>
        <Value>Withdrawn: {userStats.userTotalWithdrawn.formatted}</Value>
        <Value>Accepted: {userStats.userAmountAccepted.formatted}</Value>
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

export const UpfrontDealInformation: React.FC<{
  pool: ParsedAelinPool
}> = ({ pool }) => {
  const { chainId, sponsorFee, upfrontDeal } = pool
  if (!upfrontDeal) {
    throw new Error('UpfrontDeal not found.')
  }

  return (
    <>
      <Column>
        <InfoCell
          title="Name"
          value={
            <ExternalLink
              href={getExplorerUrl(pool.dealAddress || '', chainId)}
              label={parseDealName(upfrontDeal.name)}
            />
          }
        />
        <InfoCell
          title="Deal token"
          tooltip="The token an investor may claim after an optional vesting period if they accept the deal"
          value={
            <TokenIcon
              address={upfrontDeal.underlyingToken.token}
              network={pool.chainId}
              symbol={upfrontDeal.underlyingToken.symbol}
              type="row"
            />
          }
        />
        <InfoCell
          title="Exchange rates"
          tooltip="The ratio at which investment tokens deposited in the pool will be exchanged for deal tokens"
        >
          <Value>{`${upfrontDeal.exchangeRates.investmentPerDeal.formatted} ${upfrontDeal.underlyingToken.symbol} per ${pool.investmentTokenSymbol}`}</Value>
          <Value>{`${upfrontDeal.exchangeRates.dealPerInvestment.formatted} ${pool.investmentTokenSymbol} per ${upfrontDeal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        <InfoCell title="Deal stats" tooltip="TBD">
          <Value>Total redeemed: {pool.redeem.formatted}</Value>
          <Value>Total invested: TBD</Value>
          <Value>Remaining deal tokens: TBD</Value>
        </InfoCell>
        <InfoCell title="Deal minimum" tooltip="TBD">
          <Value>{`${upfrontDeal.purchaseRaiseMinimum.formatted} ${pool.investmentTokenSymbol}`}</Value>
        </InfoCell>
      </Column>
      <Column>
        <InfoCell
          title="Investment token"
          tooltip="The currency used to purchase pool tokens"
          value={
            <TokenIcon
              address={pool.investmentToken}
              network={pool.chainId}
              symbol={pool.investmentTokenSymbol}
              type="row"
            />
          }
        />
        <InfoCell title="Deal tokens total" tooltip="TBD">
          <Value>{`${upfrontDeal.underlyingToken.dealAmount.formatted} ${upfrontDeal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        <InfoCell
          title="Vesting Data"
          tooltip="The time investors need to wait before claiming their deal tokens after the deal is complete"
        >
          <Value>{`Cliff: ${upfrontDeal.vestingPeriod.cliff.formatted}`}</Value>
          <Value>{`Linear period: ${upfrontDeal.vestingPeriod.vesting.formatted}`}</Value>
        </InfoCell>
        <InfoCell title="Deal redemption deadline" tooltip="TBD">
          {upfrontDeal?.dealStart && (
            <DynamicDeadline
              deadline={upfrontDeal.vestingPeriod.start}
              hideWhenDeadlineIsReached={true}
              start={upfrontDeal.dealStart}
              width="180px"
            >
              {upfrontDeal.vestingPeriod.start
                ? formatDate(upfrontDeal.vestingPeriod.start, DATE_DETAILED)
                : 'N/A'}
            </DynamicDeadline>
          )}
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

export default UpfrontDealInformation
