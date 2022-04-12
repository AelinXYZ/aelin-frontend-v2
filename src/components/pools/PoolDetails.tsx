import styled from 'styled-components'

import isAfter from 'date-fns/isAfter'

import CountDown from '@/src/components/countdown'
import { CountDownDHMS } from '@/src/components/countdown/CountDownDHMS'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import CreateDealForm from '@/src/components/pools/CreateDealForm'
import FundingActions from '@/src/components/pools/FundingActions'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { AelinPoolState, isFunding } from '@/src/utils/getAelinPoolCurrentStatus'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const PoolInfo = styled.div`
  width: 500px;
`

type Props = {
  chainId: ChainsValues
  poolAddress: string
}

export default function PoolDetails({ chainId, poolAddress }: Props) {
  const { currentState, pool } = useAelinPoolStatus(chainId, poolAddress as string)
  const { address } = useWeb3Connection()

  if (!currentState) {
    return null
  }

  const showCreateDealForm =
    address?.toLowerCase() === pool.sponsor.toLowerCase() &&
    currentState.state === AelinPoolState.WaitingForDeal &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    !currentState?.meta.dealPresented

  return (
    <RightTimelineLayout timeline={<>Timeline stuff</>}>
      {!showCreateDealForm ? (
        <BaseCard>
          <Wrapper>
            <PoolInfo>
              <div>Pool details: {poolAddress}</div>
              <div>Investment</div>
              <div>token: {pool.investmentToken}</div>
              <div>
                deadline: {formatDate(pool.purchaseExpiry, DATE_DETAILED)}
                {isAfter(pool.purchaseExpiry, Date.now()) && (
                  <CountDown date={pool.purchaseExpiry} format={CountDownDHMS} />
                )}
              </div>
              <hr />
              <div>Sponsor </div>
              {pool.sponsor}
              <hr />
              <div>Pool cap </div>
              {pool.poolCap.raw.eq(ZERO_BN) ? 'unlimited' : pool.poolCap.formatted}
              <hr />
              <div>Sponsor fee </div>
              {pool.sponsorFee.formatted}
              <hr />
              <div>Deal </div>
              <div>
                deadline: {formatDate(pool.dealDeadline, DATE_DETAILED)}
                {isAfter(pool.dealDeadline, Date.now()) && (
                  <CountDown date={pool.dealDeadline} format={CountDownDHMS} />
                )}
              </div>
              <hr />
              <div>Pool details</div>
              <div>Funded: {pool.funded.formatted}</div>
              <div>Withdrawn: {pool.withdrawn.formatted}</div>
              <div>Amount in Pool: {pool.amountInPool.formatted}</div>
            </PoolInfo>

            {isFunding(currentState) && <FundingActions pool={pool} poolHelpers={currentState} />}
          </Wrapper>
        </BaseCard>
      ) : (
        <CreateDealForm pool={pool} />
      )}
    </RightTimelineLayout>
  )
}
