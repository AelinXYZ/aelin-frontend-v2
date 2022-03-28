import styled from 'styled-components'

import isAfter from 'date-fns/isAfter'
import isEmpty from 'lodash/isEmpty'

import CountDown from '@/src/components/countdown'
import { CountDownDHMS } from '@/src/components/countdown/CountDownDHMS'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinPoolMachine from '@/src/hooks/aelin/useAelinPoolMachine'
import ApproveDeposit from '@/src/page_helpers/ApproveDeposit'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

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
  const {
    state: {
      context: { isMaxCapReached, pool },
    },
  } = useAelinPoolMachine(chainId, poolAddress as string)

  if (isEmpty(pool)) {
    return null
  }

  return (
    <RightTimelineLayout timeline={<>Timeline stuff</>}>
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
          {isMaxCapReached ? (
            'Max cap reached'
          ) : (
            <ApproveDeposit
              chainId={chainId}
              investmentToken={pool.investmentToken}
              investmentTokenDecimals={pool.investmentTokenDecimals}
            />
          )}
        </Wrapper>
      </BaseCard>
    </RightTimelineLayout>
  )
}
