import styled from 'styled-components'

import { genericSuspense } from '../../helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '../../pureStyledComponents/buttons/Button'
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
  ({
    pool,
    showInvestorsModal,
    title,
    tooltip,
  }: {
    pool: ParsedAelinPool
    title: string
    tooltip: string
    showInvestorsModal: () => void
  }) => {
    return (
      <InfoCell title={title} tooltip={tooltip}>
        <Value>Accepted: {pool.upfrontDeal?.totalUsersAccepted || 0}</Value>
        <ButtonPrimaryLightSm onClick={showInvestorsModal}>See more</ButtonPrimaryLightSm>
      </InfoCell>
    )
  },
  () => <InlineLoading />,
)

export const UpfrontDealInformation: React.FC<{
  pool: ParsedAelinPool
  poolHelpers: Funding
  showInvestorsModal: () => void
}> = ({ pool, poolHelpers, showInvestorsModal }) => {
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
              href={getExplorerUrl(pool.address, chainId)}
              label={parseDealName(upfrontDeal.name)}
            />
          }
        />
        <InfoCell
          title="Deal token"
          tooltip="Token distributed in exchange for investment tokens"
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
          tooltip="Exchange rate between investment tokens and deal tokens"
        >
          <Value>{`${upfrontDeal.exchangeRates.dealPerInvestment.formatted} ${upfrontDeal.underlyingToken.symbol} per ${pool.investmentTokenSymbol}`}</Value>
          <Value>{`${upfrontDeal.exchangeRates.investmentPerDeal.formatted} ${pool.investmentTokenSymbol} per ${upfrontDeal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        <InfoCell title="Deal stats">
          <Value>{`Total redeemed: ${pool.upfrontDeal?.underlyingToken.totalRedeemed.formatted} ${upfrontDeal.underlyingToken.symbol}`}</Value>
          <Value>{`Total invested: ${pool.funded.formatted} ${pool.investmentTokenSymbol}`}</Value>
          <Value>{`Remaining deal tokens: ${pool.upfrontDeal?.underlyingToken.remaining.formatted} ${upfrontDeal.underlyingToken.symbol}`}</Value>
          {poolHelpers.capReached && (
            <Value>
              <b>Cap reached</b>
            </Value>
          )}
        </InfoCell>
        <InfoCell
          title="Deal minimum"
          tooltip="Minimum number of investment tokens required for the deal to proceed"
        >
          <Value>{`${upfrontDeal.purchaseRaiseMinimum.formatted} ${pool.investmentTokenSymbol}`}</Value>
        </InfoCell>
        <DealParticipantsInfoCell
          pool={pool}
          showInvestorsModal={showInvestorsModal}
          title="Deal participants"
          tooltip="Total number of deal participants that have accepted or declined"
        />
      </Column>
      <Column>
        <InfoCell
          title="Investment token"
          tooltip="Token exchanged for deal tokens"
          value={
            <TokenIcon
              address={pool.investmentToken}
              network={pool.chainId}
              symbol={pool.investmentTokenSymbol}
              type="row"
            />
          }
        />
        <InfoCell title="Deal tokens total" tooltip="Total number of deal tokens being distributed">
          <Value>{`${upfrontDeal.underlyingToken.dealAmount.formatted} ${upfrontDeal.underlyingToken.symbol}`}</Value>
        </InfoCell>
        <InfoCell
          title="Vesting Data"
          tooltip="Once the cliff period ends, users will begin vesting tokens based on the period specified"
        >
          <Value>{`Cliff: ${upfrontDeal.vestingPeriod.cliff.formatted}`}</Value>
          <Value>{`Linear period: ${upfrontDeal.vestingPeriod.vesting.formatted}`}</Value>
        </InfoCell>
        <InfoCell title="Deal redemption deadline" tooltip="Deadline to redeem">
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
          tooltip="Fees collected and distributed to the Sponsor and Aelin Protocol"
        >
          <Value>Sponsor Fee: {sponsorFee.formatted}</Value>
          <Value>Aelin protocol fee: 2%</Value>
        </InfoCell>
        {!!pool.minimumPurchaseAmount && (
          <InfoCell
            title="Minimum investment"
            tooltip={`The minimum amount of ${pool.investmentTokenSymbol} you may invest in this pool`}
          >
            <Value>
              {pool.minimumPurchaseAmount.formatted} {pool.investmentTokenSymbol}
            </Value>
          </InfoCell>
        )}
      </Column>
    </>
  )
}

export default UpfrontDealInformation
