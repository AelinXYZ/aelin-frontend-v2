import styled from 'styled-components'

import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'

const Container = styled.div`
  width: 500px;
`

type Props = {
  pool: ParsedAelinPool
  poolAddress: string
}

export default function DealInfo({ pool }: Props) {
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
      <div>Total redeem: {pool.redeem.formatted}</div>
      <div>Total withdrawn: {pool.withdrawn.formatted}</div>

      <br />
      <div>User stats</div>
      <div>Remaining pro-rata allocation: TBD</div>
      <div>Withdrawn: TBD</div>

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
