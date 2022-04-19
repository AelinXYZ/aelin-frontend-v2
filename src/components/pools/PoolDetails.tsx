import Head from 'next/head'
import styled from 'styled-components'

import { CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import CreateDealForm from '@/src/components/pools/CreateDealForm'
import FundingActions from '@/src/components/pools/FundingActions'
import { Timeline } from '@/src/components/pools/Timeline'
import DealInfo from '@/src/components/pools/poolDetails/DealInfo'
import PoolInfo from '@/src/components/pools/poolDetails/PoolInfo'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { ChainsValues } from '@/src/constants/chains'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import { isFunding, isWaitingForDeal } from '@/types/AelinPoolStatus'

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

export default function PoolDetails({ chainId, poolAddress }: Props) {
  const { currentStatus, pool } = useAelinPoolStatus(chainId, poolAddress as string)

  if (!currentStatus) {
    return null
  }

  const mockedPoolVisibility = '???'

  const showCreateDealForm =
    isWaitingForDeal(currentStatus) && currentStatus.meta.showCreateDealForm

  return (
    <>
      <Head>
        <title>Aelin - {pool.nameFormatted}</title>
      </Head>
      <PageTitle subTitle={mockedPoolVisibility} title={pool.nameFormatted} />
      <RightTimelineLayout timeline={<Timeline activeItem={showCreateDealForm ? 3 : 2} />}>
        {showCreateDealForm ? (
          <CreateDealForm pool={pool} />
        ) : (
          <MainGrid>
            <CardWithTitle title="Pool information">
              {/* PoolInfo is always visible */}
              <ContentGrid>
                <PoolInfo pool={pool} poolAddress={poolAddress} />
              </ContentGrid>
              {/* Show Deal info, if pool already has a dealAddress */}
              {pool.dealAddress && (
                <ContentGrid>
                  <DealInfo pool={pool} poolAddress={poolAddress} />
                </ContentGrid>
              )}
            </CardWithTitle>
            <ActionsCard>
              {isFunding(currentStatus) ? (
                <FundingActions pool={pool} poolHelpers={currentStatus} />
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
