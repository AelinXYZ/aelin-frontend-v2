import Head from 'next/head'
import { useState } from 'react'
import styled from 'styled-components'

import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import Funding from '@/src/components/pools/actions/Funding'
import { Timeline } from '@/src/components/pools/common/Timeline'
import DealCreate from '@/src/components/pools/deal/DealCreate'
import DealInformation from '@/src/components/pools/deal/DealInformation'
import PoolInformation from '@/src/components/pools/main/PoolInformation'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { ChainsValues } from '@/src/constants/chains'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import { PoolState } from '@/types/aelinPool'

const MainGrid = styled.div`
  column-gap: 65px;
  display: grid;
  row-gap: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr 310px;
  }
`

const ContentGrid = styled.div`
  display: grid;
  row-gap: 20px;
  column-gap: 70px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr 1fr;
  }
`

const ActionsCard = styled(BaseCard)`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: fit-content;
  justify-content: center;
  min-height: 236px;
  padding: 30px 40px;
`

type Props = {
  chainId: ChainsValues
  poolAddress: string
}

export default function PoolMain({ chainId, poolAddress }: Props) {
  const { currentStatus, pool } = useAelinPoolStatus(chainId, poolAddress as string)
  const mockedPoolVisibility = '???'
  const showCreateDealForm =
    currentStatus.state === PoolState.WaitingForDeal &&
    currentStatus.waitingForDealStatus.showCreateDealForm

  type TabType = 'poolInformation' | 'dealInformation'

  const [tab, setTab] = useState<TabType>('poolInformation')

  return !currentStatus ? null : (
    <>
      <Head>
        <title>Aelin - {pool.nameFormatted}</title>
      </Head>
      <PageTitle subTitle={mockedPoolVisibility} title={pool.nameFormatted} />
      <RightTimelineLayout timeline={<Timeline activeItem={showCreateDealForm ? 3 : 2} />}>
        {showCreateDealForm ? (
          <DealCreate pool={pool} />
        ) : (
          <MainGrid>
            <CardWithTitle
              titles={
                <>
                  <CardTitle
                    isActive={tab === 'poolInformation'}
                    onClick={() => setTab('poolInformation')}
                  >
                    Pool information
                  </CardTitle>
                  {pool.dealAddress && (
                    <CardTitle
                      isActive={tab === 'dealInformation'}
                      onClick={() => setTab('dealInformation')}
                    >
                      Deal information
                    </CardTitle>
                  )}
                </>
              }
            >
              <ContentGrid>
                {tab === 'poolInformation' && (
                  <PoolInformation pool={pool} poolAddress={poolAddress} />
                )}
                {pool.dealAddress && tab === 'dealInformation' && (
                  <DealInformation
                    pool={pool}
                    poolStatusHelper={currentStatus.waitingForDealStatus}
                  />
                )}
              </ContentGrid>
            </CardWithTitle>
            <ActionsCard>
              {currentStatus.state === PoolState.Funding ? (
                <Funding pool={pool} poolHelpers={currentStatus.fundingStatus} />
              ) : (
                <>No actions available now.</>
              )}
            </ActionsCard>
          </MainGrid>
        )}
      </RightTimelineLayout>
    </>
  )
}
