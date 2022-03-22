import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import isAfter from 'date-fns/isAfter'
import isEmpty from 'lodash/isEmpty'
import nullthrows from 'nullthrows'

import CountDown from '@/src/components/countdown'
import { CountDownDHMS } from '@/src/components/countdown/CountDownDHMS'
import { genericSuspense } from '@/src/components/safeSuspense'
import { Chains, ChainsKeys } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinPoolMachine from '@/src/hooks/aelin/useAelinPoolMachine'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

const PoolDetails: NextPage = () => {
  const router = useRouter()
  const { address, network } = router.query

  const chainId = nullthrows(
    Object.keys(Chains).includes(network as string) ? Chains[network as ChainsKeys] : null,
    'Unsupported chain passed as url parameter.',
  )

  const {
    state: {
      context: { pool },
    },
  } = useAelinPoolMachine(chainId, address as string)

  if (isEmpty(pool)) {
    return null
  }

  return (
    <div>
      <div>Investment </div>
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
      <div>Pool details: {address}</div>
      <div>Funded: {pool.funded.formatted}</div>
      <div>Withdrawn: {pool.withdrawn.formatted}</div>
      <div>Amount in Pool: {pool.amountInPool.formatted}</div>
    </div>
  )
}

export default genericSuspense(PoolDetails, () => <div>Loading..</div>)
