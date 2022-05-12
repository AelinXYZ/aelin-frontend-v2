import Head from 'next/head'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ActionTabs } from '@/src/components/common/ActionTabs'
import { CardTitle, CardWithTitle } from '@/src/components/common/CardWithTitle'
import { PageTitle } from '@/src/components/common/PageTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import AcceptDeal from '@/src/components/pools/actions/AcceptDeal'
import Claim from '@/src/components/pools/actions/Claim'
import CreateDeal from '@/src/components/pools/actions/CreateDeal'
import FundDeal from '@/src/components/pools/actions/FundDeal'
import Invest from '@/src/components/pools/actions/Invest'
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
  const { actions, current, dealing, funding, pool, tabs, timeline } = useAelinPoolStatus(
    chainId,
    poolAddress as string,
  )
  const { address, getExplorerUrl } = useWeb3Connection()

  if (!current) {
    throw new Error('There was no possible to calculate pool current status')
  }

  const [tab, setTab] = useState<PoolTab>(tabs[tabs.length - 1])
  const [action, setAction] = useState<PoolAction>(actions[0])
  const dealExists = pool.deal
  // const noActionTabsTitle =
  //   !actions.length || action === PoolAction.Invest || action === PoolAction.AwaitingForDeal

  useEffect(() => {
    setAction(actions[0])
  }, [actions])

  const isHolder = pool.deal?.holderAddress === address?.toLowerCase()

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
            titles={
              <>
                {tabs.includes(PoolTab.PoolInformation) && (
                  <CardTitle
                    isActive={tab === PoolTab.PoolInformation}
                    onClick={() => setTab(PoolTab.PoolInformation)}
                  >
                    Pool information
                  </CardTitle>
                )}
                {tabs.includes(PoolTab.DealInformation) && dealExists && (
                  <CardTitle
                    isActive={tab === PoolTab.DealInformation}
                    onClick={() => setTab(PoolTab.DealInformation)}
                  >
                    Deal information
                  </CardTitle>
                )}
                {tabs.includes(PoolTab.WithdrawUnredeemed) &&
                  pool.unredeemed.raw.gt(0) &&
                  isHolder && (
                    <CardTitle
                      isActive={tab === PoolTab.WithdrawUnredeemed}
                      onClick={() => setTab(PoolTab.WithdrawUnredeemed)}
                    >
                      Unredeemed
                    </CardTitle>
                  )}
                {tabs.includes(PoolTab.Vest) && (
                  <CardTitle isActive={tab === PoolTab.Vest} onClick={() => setTab(PoolTab.Vest)}>
                    Vest
                  </CardTitle>
                )}
              </>
            }
          >
            <ContentGrid>
              {tab === PoolTab.PoolInformation && (
                <PoolInformation pool={pool} poolStatusHelper={funding} />
              )}
              {tab === PoolTab.DealInformation && dealExists && (
                <DealInformation pool={pool} poolStatusHelper={dealing} />
              )}
              {tab === PoolTab.Vest && <VestingInformation pool={pool} />}
            </ContentGrid>
          </CardWithTitle>
          <ActionTabs
            active={action}
            onTabClick={setAction}
            tabs={/* noActionTabsTitle ? undefined : */ actions}
          >
            {!actions.length && <div>No actions available</div>}
            {action === PoolAction.Invest && <Invest pool={pool} poolHelpers={funding} />}
            {action === PoolAction.AwaitingForDeal && <WaitingForDeal />}
            {action === PoolAction.Withdraw && <WithdrawalFromPool pool={pool} />}
            {action === PoolAction.CreateDeal && <CreateDeal pool={pool} />}
            {action === PoolAction.AcceptDeal && <AcceptDeal dealing={dealing} pool={pool} />}
            {action === PoolAction.FundDeal && <FundDeal pool={pool} />}
            {action === PoolAction.Claim && <Claim pool={pool} />}
          </ActionTabs>
        </MainGrid>
      </RightTimelineLayout>
    </>
  )
}
