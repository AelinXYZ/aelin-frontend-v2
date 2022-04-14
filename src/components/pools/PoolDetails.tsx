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
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { AelinPoolState, isFunding } from '@/src/utils/getAelinPoolCurrentStatus'

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

  const poolName = pool.name.split('aePool-').pop() || ''

  return (
    <>
      <Head>
        <title>Aelin - {poolName}</title>
      </Head>
      <PageTitle subTitle={mockedPoolVisibility} title={poolName} />
      <RightTimelineLayout timeline={<Timeline activeItem={showCreateDealForm ? 3 : 2} />}>
        {showCreateDealForm ? (
          <CreateDealForm pool={pool} />
        ) : (
          <MainGrid>
            <CardWithTitle title="Pool information">
              <ContentGrid>
                <PoolInfo pool={pool} poolAddress={poolAddress} />
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                {currentState?.meta.dealPresented && (
                  <DealInfo pool={pool} poolAddress={poolAddress} />
                )}
              </ContentGrid>
            </CardWithTitle>
            <ActionsCard>
              {isFunding(currentState) ? (
                <FundingActions pool={pool} poolHelpers={currentState} />
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
