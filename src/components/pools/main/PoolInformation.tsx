import { useEffect } from 'react'
import styled from 'styled-components'

import isAfter from 'date-fns/isAfter'

import { TokenIcon } from '../common/TokenIcon'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { DynamicDeadline } from '@/src/components/common/DynamicDeadline'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import UserInvestmentTokenBalance from '@/src/components/pools/common/UserInvestmentTokenBalance'
import InlineLoading from '@/src/components/pureStyledComponents/common/InlineLoading'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useUserAllocationStats } from '@/src/hooks/aelin/useUserAllocationStats'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

type Props = {
  pool: ParsedAelinPool
}

const UserStatsInfoCell = genericSuspense(
  ({ pool }: { pool: ParsedAelinPool }) => {
    const { data: userAllocationStat, refetch } = useUserAllocationStats(
      pool.address,
      pool.chainId,
      pool.investmentTokenDecimals,
    )

    useEffect(() => {
      pool.amountInPool
      refetch()
    }, [refetch, pool.amountInPool])

    return <span>{`${userAllocationStat.formatted || 0} ${pool.investmentTokenSymbol}`}</span>
  },
  () => <InlineLoading />,
)

const PoolParticipantsInfoCell = genericSuspense(
  ({ pool, title, tooltip }: { pool: ParsedAelinPool; title: string; tooltip: string }) => {
    return (
      <InfoCell title={title} tooltip={tooltip}>
        <Value>{pool.totalUsersInvested}</Value>
      </InfoCell>
    )
  },
  () => <InlineLoading />,
)

export const PoolInformation = ({ pool }: Props) => {
  const now = new Date()

  return (
    <>
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
        <InfoCell
          title="Pool cap"
          tooltip="Maximum number of Investment tokens"
          value={pool.poolCap.raw.eq(ZERO_BN) ? 'Uncapped' : pool.poolCap.formatted}
        />
        <InfoCell
          title="Pool stats"
          tooltip="The total amount of tokens all investors have deposited, withdrawn and the remaining amount in the pool"
        >
          <Value>Funded: {pool.funded.formatted}</Value>
          <Value>Withdrawn: {pool.withdrawn.formatted}</Value>
          <Value>Amount in Pool: {pool.amountInPool.formatted}</Value>
        </InfoCell>
        <InfoCell
          title={`My ${pool.investmentTokenSymbol} balance`}
          value={<UserInvestmentTokenBalance pool={pool} />}
        />
        <InfoCell
          title="My pool balance"
          tooltip="The number of investment tokens you have deposited"
          value={<UserStatsInfoCell pool={pool} />}
        />
      </Column>
      <Column>
        {!pool.upfrontDeal && pool.purchaseExpiry && (
          <InfoCell
            title="Investment deadline"
            tooltip="The amount of time investors have to deposit Investment tokens"
          >
            <DynamicDeadline
              deadline={pool.purchaseExpiry}
              hideWhenDeadlineIsReached={true}
              start={pool.start}
              width="180px"
            >
              {formatDate(pool.purchaseExpiry, DATE_DETAILED)}
            </DynamicDeadline>
          </InfoCell>
        )}
        {pool.dealDeadline && (
          <InfoCell
            title="Deal deadline"
            tooltip="The amount of time a sponsor has to find a deal before investors can withdraw their funds. A deal may still be created after the deadline if funds are still in the pool."
            value={formatDate(pool.dealDeadline, DATE_DETAILED)}
          >
            {pool.purchaseExpiry && isAfter(now, pool.purchaseExpiry) && (
              <DynamicDeadline
                deadline={pool.dealDeadline}
                hideWhenDeadlineIsReached={true}
                start={pool.purchaseExpiry}
                width="180px"
              >
                {formatDate(pool.dealDeadline, DATE_DETAILED)}
              </DynamicDeadline>
            )}
          </InfoCell>
        )}
        <InfoCell
          title="Sponsor"
          tooltip="The sponsor will seek a deal on behalf of investors entering this pool"
          value={<ENSOrAddress address={pool.sponsor} network={pool.chainId} />}
        />
        <InfoCell
          title="Sponsor fee"
          tooltip="The fee paid to the sponsor for each deal token redeemed, paid in deal tokens"
          value={pool.sponsorFee.formatted}
        />
        <PoolParticipantsInfoCell
          pool={pool}
          title="Pool participants"
          tooltip="Total amount of users who invested in the pool"
        />
      </Column>
    </>
  )
}

export default PoolInformation
