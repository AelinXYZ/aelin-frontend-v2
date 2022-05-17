import Head from 'next/head'
import styled from 'styled-components'

import WithdrawUnredeemed from './actions/WithdrawUnredeemed'
import UnredeemedInformation from './deal/UnredeemedInformation'
import { ActionTabs } from '@/src/components/common/ActionTabs'
import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import AcceptDeal from '@/src/components/pools/actions/AcceptDeal'
import Claim from '@/src/components/pools/actions/Claim'
import CreateDeal from '@/src/components/pools/actions/CreateDeal'
import FundDeal from '@/src/components/pools/actions/FundDeal'
import Invest from '@/src/components/pools/actions/Invest'
import ReleaseFunds from '@/src/components/pools/actions/ReleaseFunds'
import WaitingForDeal from '@/src/components/pools/actions/WaitingForDeal'
import WithdrawalFromPool from '@/src/components/pools/actions/WithdrawalFromPool'
import DealInformation from '@/src/components/pools/deal/DealInformation'
import VestingInformation from '@/src/components/pools/deal/VestingInformation'
import PoolInformation from '@/src/components/pools/main/PoolInformation'
import { ChainsValues } from '@/src/constants/chains'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { PoolAction, PoolTab } from '@/types/aelinPool'

const MainGrid = styled.div`
  column-gap: 65px;
  display: grid;
  row-gap: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr 310px;
  }
`

const ContentGrid = styled.div`
  column-gap: 70px;
  display: grid;
  row-gap: 20px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: 1fr 1fr;
  }
`

type Props = {
  chainId: ChainsValues
  poolAddress: string
}

export default function PoolMain({ chainId, poolAddress }: Props) {
  const { dealing, funding, pool, tabs, timeline } = useAelinPoolStatus(
    chainId,
    poolAddress as string,
  )
  const { getExplorerUrl } = useWeb3Connection()

  return (
    <>
      <Head>
        <title>Aelin - {pool.nameFormatted}</title>
      </Head>
      <PageTitle
        href={getExplorerUrl(pool.address || '')}
        subTitle={pool.poolType}
        title={pool.nameFormatted}
      />
      <RightTimelineLayout timelineSteps={timeline}>
        <MainGrid>
          <CardWithTitle
            titles={tabs.states.map((tabState) => (
              <CardTitle
                isActive={tabs.active === tabState}
                key={tabState}
                onClick={() => tabs.setActive(tabState)}
              >
                {tabState}
              </CardTitle>
            ))}
          >
            <ContentGrid>
              {tabs.active === PoolTab.PoolInformation && (
                <PoolInformation pool={pool} poolStatusHelper={funding} />
              )}
              {tabs.active === PoolTab.DealInformation && !!pool.deal && (
                <DealInformation pool={pool} poolStatusHelper={dealing} />
              )}
              {tabs.active === PoolTab.WithdrawUnredeemed && <UnredeemedInformation pool={pool} />}
              {tabs.active === PoolTab.Vest && <VestingInformation pool={pool} />}
            </ContentGrid>
            {tabs.actions.states.includes(PoolAction.ReleaseFunds) && <ReleaseFunds pool={pool} />}
          </CardWithTitle>
          <ActionTabs
            active={tabs.actions.active}
            onTabClick={tabs.actions.setActive}
            tabs={tabs.actions.states.filter((a) => a === PoolAction.ReleaseFunds)}
          >
            {!tabs.actions.states.length && <div>No actions available</div>}
            {tabs.actions.active === PoolAction.Invest && (
              <Invest pool={pool} poolHelpers={funding} />
            )}
            {tabs.actions.active === PoolAction.AwaitingForDeal && <WaitingForDeal />}
            {tabs.actions.active === PoolAction.Withdraw && <WithdrawalFromPool pool={pool} />}
            {tabs.actions.active === PoolAction.CreateDeal && <CreateDeal pool={pool} />}
            {tabs.actions.active === PoolAction.AcceptDeal && (
              <AcceptDeal dealing={dealing} pool={pool} />
            )}
            {tabs.actions.active === PoolAction.FundDeal && <FundDeal pool={pool} />}
            {tabs.actions.active === PoolAction.Claim && <Claim pool={pool} />}
            {tabs.actions.active === PoolAction.WithdrawUnredeemed && (
              <WithdrawUnredeemed pool={pool} />
            )}
          </ActionTabs>
        </MainGrid>
      </RightTimelineLayout>
    </>
  )
}
