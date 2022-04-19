import styled from 'styled-components'

import isAfter from 'date-fns/isAfter'

import CountDown from '@/src/components/countdown'
import { CountDownDHMS } from '@/src/components/countdown/CountDownDHMS'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

const Container = styled.div``

export const DealInformation: React.FC<{
  pool: ParsedAelinPool
  poolAddress: string
}> = ({ pool, poolAddress }) => {
  console.log(pool)
  // if (!pool.deal || !pool.deal.proRataRedemption) {
  if (!pool.deal) {
    return <div>No Deal presented yet.</div>
  }
  const deal = pool.deal
  return (
    <Container>
      <div>Deal details</div>

      <div>Name: {deal.name}</div>
      <div>Symbol: {deal.symbol}</div>

      <br />
      <div>DealToken: {deal.underlyingToken.token}</div>
      <div>Deal Tokens: {deal.underlyingToken.dealAmount.formatted}</div>

      <br />
      <div>ExchangeRates:</div>
      <div>{`${pool.deal.exchangeRates.investmentPerDeal.formatted} ${pool.deal.underlyingToken.symbol}  per ${pool.investmentTokenSymbol}`}</div>
      <div>{`${pool.deal.exchangeRates.dealPerInvestment.formatted} ${pool.investmentTokenSymbol}  per ${pool.deal.underlyingToken.symbol}`}</div>

      <br />
      <div>Deal stage</div>
      {/*{pool.deal.proRataRedemption.stage === 1*/}
      {/*  ? 'Round 1: Pro Rata Redemption'*/}
      {/*  : pool.deal.proRataRedemption.stage === 2*/}
      {/*  ? 'Round 2: Open Redemption'*/}
      {/*  : 'Redemption closed'}*/}

      {/*<br />*/}
      {/*<div>Round 1 Deadline</div>*/}
      {/*{pool.deal.proRataRedemption.proRataRedemptionEnd.toString()}*/}

      {/*<br />*/}
      {/*<div>Round 2 Deadline</div>*/}
      {/*{pool.deal.proRataRedemption.openRedemptionEnd*/}
      {/*  ? pool.deal.proRataRedemption.openRedemptionEnd.toString()*/}
      {/*  : ' - No Open period'}*/}

      <br />
      <div>Pool stats</div>
      <div>Amount in pool: {pool.amountInPool.formatted}</div>
      <div>Total redeem: </div>
      {pool.investmentRaisedAmount.formatted}
      <div>Total withdrawn: {pool.withdrawn.formatted}</div>

      <br />
      <div>User stats</div>
      <div>Waiting for the user subgraph</div>

      <br />
      <div>Vesting data</div>
      <div>Cliff: </div>
      <div>Linear period:</div>

      <br />
      <div>Fees charged on accept</div>
      <div>Sponsor Fee: {pool.sponsorFee.formatted}</div>
      <div>Aelin protocol fee: 2%</div>

      {/* <div>Has Open period: {pool.deal.hasDealOpenPeriod ? 'yes' : 'no'}</div> */}

      {/* <div>
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
      <div>Amount in Pool: {pool.amountInPool.formatted}</div> */}
    </Container>
  )
}

export default DealInformation
