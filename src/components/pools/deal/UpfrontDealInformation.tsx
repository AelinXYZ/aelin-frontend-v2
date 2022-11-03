import styled from 'styled-components'

import { genericSuspense } from '../../helpers/SafeSuspense'
import InlineLoading from '../../pureStyledComponents/common/InlineLoading'
import { TokenIcon } from '../common/TokenIcon'
import { DynamicDeadline } from '@/src/components/common/DynamicDeadline'
import ExternalLink from '@/src/components/common/ExternalLink'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
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

const DealParticipantsInfoCell = genericSuspense(
  ({ pool, title, tooltip }: { pool: ParsedAelinPool; title: string; tooltip: string }) => {
    return (
      <InfoCell title={title} tooltip={tooltip}>
        <Value>Accepted: {pool.upfrontDeal?.totalUsersAccepted || 0}</Value>
      </InfoCell>
    )
  },
  () => <InlineLoading />,
)

export const UpfrontDealInformation: React.FC<{
  pool: ParsedAelinPool
  poolHelpers: Funding
}> = ({ pool, poolHelpers }) => {
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
          <Value>{`${upfrontDeal.exchangeRates.dealPerInvestment.formatted} ${upfrontDeal.underlyingToken.symbol} per ${pool.investmentTokenSymbol}`}</Value>
          <Value>{`${upfrontDeal.exchangeRates.investmentPerDeal.formatted} ${pool.investmentTokenSymbol} per ${upfrontDeal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        {/* TODO: Add tooltip */}
        <InfoCell title="Deal stats">
          <Value>Total redeemed: {pool.upfrontDeal?.underlyingToken.totalRedeemed.formatted}</Value>
          <Value>Total invested: {pool.funded.formatted} </Value>
          <Value>
            Remaining deal tokens: {pool.upfrontDeal?.underlyingToken.remaining.formatted}
          </Value>
          {poolHelpers.capReached && (
            <Value>
              <b>Cap reached</b>
            </Value>
          )}
        </InfoCell>
        {/* TODO: Add tooltip */}
        <InfoCell title="Deal minimum">
          <Value>{`${upfrontDeal.purchaseRaiseMinimum.formatted} ${pool.investmentTokenSymbol}`}</Value>
        </InfoCell>
        <DealParticipantsInfoCell
          pool={pool}
          title="Deal participants"
          tooltip="Total amount of users who accepted"
        />
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
        {/* TODO: Add tooltip */}
        <InfoCell title="Deal tokens total">
          <Value>{`${upfrontDeal.underlyingToken.dealAmount.formatted} ${upfrontDeal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        <InfoCell
          title="Vesting Data"
          tooltip="The time investors need to wait before claiming their deal tokens after the deal is complete"
        >
          <Value>{`Cliff: ${upfrontDeal.vestingPeriod.cliff.formatted}`}</Value>
          <Value>{`Linear period: ${upfrontDeal.vestingPeriod.vesting.formatted}`}</Value>
        </InfoCell>
        {/* TODO: Add tooltip */}
        <InfoCell title="Deal redemption deadline">
          {upfrontDeal?.dealStart ? (
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
          ) : (
            'Deal has not started yet'
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
