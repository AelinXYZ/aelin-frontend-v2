import Head from 'next/head'
import styled from 'styled-components'

import isAfter from 'date-fns/isAfter'

import { CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import CountDown from '@/src/components/countdown'
import { CountDownDHMS } from '@/src/components/countdown/CountDownDHMS'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import CreateDealForm from '@/src/components/pools/CreateDealForm'
import FundingActions from '@/src/components/pools/FundingActions'
import { PoolInfoItem, Value } from '@/src/components/pools/PoolInfoItem'
import { Timeline } from '@/src/components/pools/Timeline'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { AelinPoolState, isFunding } from '@/src/utils/getAelinPoolCurrentStatus'

const MainGrid = styled.div`
  column-gap: 65px;
  display: grid;
  grid-template-columns: 1fr 310px;
  row-gap: 20px;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  column-gap: 70px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
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

  const mockedPoolVisibility = 'Public pool'

  const showCreateDealForm =
    address?.toLowerCase() === pool.sponsor.toLowerCase() &&
    currentState.state === AelinPoolState.WaitingForDeal &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    !currentState?.meta.dealPresented

  return (
    <>
      <Head>
        <title>Aelin - {pool.name}</title>
      </Head>
      <PageTitle subTitle={mockedPoolVisibility} title={pool.name} />
      <RightTimelineLayout timeline={<Timeline activeItem={showCreateDealForm ? 3 : 2} />}>
        {showCreateDealForm ? (
          <CreateDealForm pool={pool} />
        ) : (
          <MainGrid>
            <CardWithTitle title="Pool information">
              <ContentGrid>
                <Column>
                  <PoolInfoItem title="Investment token" value={pool.investmentTokenSymbol} />
                  <PoolInfoItem
                    title="Pool cap"
                    value={pool.poolCap.raw.eq(ZERO_BN) ? 'unlimited' : pool.poolCap.formatted}
                  />
                  <PoolInfoItem title="Pool stats">
                    <Value>Funded: {pool.funded.formatted}</Value>
                    <Value>Withdrawn: {pool.withdrawn.formatted}</Value>
                    <Value>Amount in Pool: {pool.amountInPool.formatted}</Value>
                  </PoolInfoItem>
                  <PoolInfoItem title={`My ${pool.investmentTokenSymbol} balance`} value={'0.00'} />
                  <PoolInfoItem title="My pool balance" value={'0.00'} />
                </Column>
                <Column>
                  <PoolInfoItem
                    title="Investment deadline"
                    value={formatDate(pool.purchaseExpiry, DATE_DETAILED)}
                  />
                  <PoolInfoItem
                    title="Deal deadline"
                    value={formatDate(pool.dealDeadline, DATE_DETAILED)}
                  />
                  <PoolInfoItem title="Sponsor" value={pool.sponsor} />
                  <PoolInfoItem title="Sponsor fee" value={pool.sponsorFee.formatted} />
                </Column>
              </ContentGrid>
            </CardWithTitle>
            <div>
              {isFunding(currentState) && <FundingActions pool={pool} poolHelpers={currentState} />}
            </div>
          </MainGrid>
        )}
      </RightTimelineLayout>
    </>
  )
}
