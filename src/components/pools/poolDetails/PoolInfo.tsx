import isAfter from 'date-fns/isAfter'

import CountDown from '@/src/components/countdown'
import { CountDownDHMS } from '@/src/components/countdown/CountDownDHMS'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

type Props = {
  pool: ParsedAelinPool
  poolAddress: string
}

export default function PoolInfo({ pool, poolAddress }: Props) {
  return (
    <>
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
      <div>Funded: {pool.investmentRaisedAmount.formatted}</div>
      <div>Withdrawn: {pool.withdrawn.formatted}</div>
      <div>Amount in Pool: {pool.amountInPool.formatted}</div>
    </>
  )
}
