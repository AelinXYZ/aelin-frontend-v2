import Head from 'next/head'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { NotificationType } from '@/graphql-schema'
import { ActionTabs } from '@/src/components/common/ActionTabs'
import {
  CardWithTitle as BaseCardWithTitle,
  CardTitle,
} from '@/src/components/common/CardWithTitle'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import AcceptDeal from '@/src/components/pools/actions/AcceptDeal'
import CreateDeal from '@/src/components/pools/actions/CreateDeal'
import FundDeal from '@/src/components/pools/actions/FundDeal'
import Invest from '@/src/components/pools/actions/Invest'
import ReleaseFunds from '@/src/components/pools/actions/ReleaseFunds'
import Vest from '@/src/components/pools/actions/Vest/Vest'
import WaitingForDeal from '@/src/components/pools/actions/WaitingForDeal'
import WithdrawUnredeemed from '@/src/components/pools/actions/WithdrawUnredeemed'
import WithdrawalFromPool from '@/src/components/pools/actions/WithdrawalFromPool'
import DealInformation from '@/src/components/pools/deal/DealInformation'
import UnredeemedInformation from '@/src/components/pools/deal/UnredeemedInformation'
import VestingInformation from '@/src/components/pools/deal/VestingInformation'
import PoolInformation from '@/src/components/pools/main/PoolInformation'
import { PageTitle } from '@/src/components/section/PageTitle'
import { ChainsValues, chainsConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
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
  column-gap: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    column-gap: 70px;
  }
`

const CardWithTitle = styled(BaseCardWithTitle)`
  order: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    order: 0;
  }
`

type Props = {
  chainId: ChainsValues
  poolAddress: string
}

export default function PoolMain({ chainId, poolAddress }: Props) {
  const {
    query: { notification },
  } = useRouter()

  const { address: walletAddress } = useWeb3Connection()
  const [balance, refetchBalance] = useERC20Call(chainId, poolAddress, 'balanceOf', [
    walletAddress || ZERO_ADDRESS,
  ])

  const { funding, pool, tabs, timeline } = useAelinPoolStatus(
    chainId,
    poolAddress as string,
    balance,
    {
      tabs: notification as NotificationType,
    },
  )

  return (
    <>
      <Head>
        <title>Aelin - {pool.nameFormatted} </title>
      </Head>
      <PageTitle
        href={getExplorerUrl(pool.address || '', pool.chainId)}
        network={chainsConfig[pool.chainId].icon}
        subTitle={pool.poolType ? pool.poolType + ' pool' : ''}
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
              {tabs.active === PoolTab.PoolInformation && <PoolInformation pool={pool} />}
              {tabs.active === PoolTab.DealInformation && !!pool.deal && (
                <DealInformation pool={pool} />
              )}
              {tabs.active === PoolTab.WithdrawUnredeemed && <UnredeemedInformation pool={pool} />}
              {tabs.active === PoolTab.Vest && <VestingInformation pool={pool} />}
            </ContentGrid>
            {tabs.isReleaseFundsAvailable && <ReleaseFunds pool={pool} />}
          </CardWithTitle>
          <ActionTabs
            active={tabs.actionTabs.active}
            onTabClick={tabs.actionTabs.setActive}
            tabs={tabs.actionTabs.states}
          >
            <RequiredConnection
              isNotConnectedText="Connect your wallet"
              minHeight={175}
              networkToCheck={pool.chainId}
            >
              <>
                {!tabs.actionTabs.states.length && <div>No actions available</div>}

                {tabs.actionTabs.active === PoolAction.Invest && (
                  <Invest pool={pool} poolHelpers={funding} />
                )}
                {tabs.actionTabs.active === PoolAction.AwaitingForDeal && <WaitingForDeal />}
                {tabs.actionTabs.active === PoolAction.Withdraw && (
                  <WithdrawalFromPool
                    balance={balance}
                    pool={pool}
                    refetchBalance={refetchBalance}
                  />
                )}
                {tabs.actionTabs.active === PoolAction.CreateDeal && <CreateDeal pool={pool} />}
                {tabs.actionTabs.active === PoolAction.AcceptDeal && <AcceptDeal pool={pool} />}
                {tabs.actionTabs.active === PoolAction.FundDeal && <FundDeal pool={pool} />}
                {tabs.actionTabs.active === PoolAction.Vest && <Vest pool={pool} />}
                {tabs.actionTabs.active === PoolAction.WithdrawUnredeemed && (
                  <WithdrawUnredeemed pool={pool} />
                )}
              </>
            </RequiredConnection>
          </ActionTabs>
        </MainGrid>
      </RightTimelineLayout>
    </>
  )
}
