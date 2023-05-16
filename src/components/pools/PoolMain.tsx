import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'

import NoActions from './actions/NoActions'
import ClaimUpfrontDealTokens from './actions/Vest/ClaimUpfrontDealTokens'
import VestUpfrontDeal from './actions/Vest/VestUpfrontDeal'
import Vouch from './actions/Vouch/Vouch'
import InvestorsModal from './common/InvestorsModal'
import UpfrontDealInformation from './deal/UpfrontDealInformation'
import NftCollectionsTable from './nftTable/NftCollectionsTable'
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
import Invest from '@/src/components/pools/actions/Invest/Invest'
import InvestDirectDeal from '@/src/components/pools/actions/Invest/InvestUpfrontDeal'
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
import { VerifiedPoolsSocials } from '@/src/constants/verifiedPoolsSocials'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import { useCheckVerifiedPool } from '@/src/hooks/aelin/useCheckVerifiedPool'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import NftSelectionProvider from '@/src/providers/nftSelectionProvider'
import { getPoolType } from '@/src/utils/aelinPoolUtils'
import { getExplorerUrl } from '@/src/utils/getExplorerUrl'
import { DerivedStatus, Funding, PoolAction, PoolStatus, PoolTab } from '@/types/aelinPool'

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

const ActionsWrapper = styled.div`
  gap: 20px;
  display: flex;
  flex-direction: column;
`

type Props = {
  chainId: ChainsValues
  poolAddress: string
}

export default function PoolMain({ chainId, poolAddress }: Props) {
  const {
    query: { notification },
  } = useRouter()

  const [showInvestorsModal, setShowInvestorsModal] = useState<boolean>(false)

  const { derivedStatus, funding, pool, tabs, timeline } = useAelinPoolStatus(
    chainId,
    poolAddress as string,
    {
      tabs: notification as NotificationType,
    },
  )

  console.log('funding: ', funding)

  const isVerified = useCheckVerifiedPool(pool)

  const handleCloseInvestorsModal = () => setShowInvestorsModal(false)
  const handleOpenInvestorsModal = () => setShowInvestorsModal(true)

  return (
    <>
      <Head>
        <title>Aelin - {pool.nameFormatted} </title>
      </Head>
      <PageTitle
        href={getExplorerUrl(pool.address || '', pool.chainId)}
        isVerified={isVerified ?? false}
        network={chainsConfig[pool.chainId].icon}
        poolSocials={isVerified ? VerifiedPoolsSocials[pool.address] : undefined}
        subTitle={pool.poolType || pool.hasNftList ? getPoolType(pool) + ' pool' : ''}
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
                <PoolInformation pool={pool} showInvestorsModal={handleOpenInvestorsModal} />
              )}
              {tabs.active === PoolTab.DealInformation && !!pool.deal && (
                <DealInformation pool={pool} poolHelpers={funding} />
              )}
              {tabs.active === PoolTab.DealInformation && !!pool.upfrontDeal && (
                <UpfrontDealInformation
                  pool={pool}
                  poolHelpers={funding}
                  showInvestorsModal={handleOpenInvestorsModal}
                />
              )}
              {tabs.active === PoolTab.WithdrawUnredeemed && <UnredeemedInformation pool={pool} />}
              {tabs.active === PoolTab.Vest && <VestingInformation pool={pool} />}
            </ContentGrid>
            {tabs.isReleaseFundsAvailable && <ReleaseFunds pool={pool} />}
          </CardWithTitle>
          <ActionsWrapper>
            <ActionTabs
              active={tabs.actionTabs.active}
              onTabClick={tabs.actionTabs.setActive}
              tabs={tabs.actionTabs.states}
            >
              <NftSelectionProvider>
                <RequiredConnection
                  isNotConnectedText="Connect your wallet"
                  minHeight={175}
                  networkToCheck={pool.chainId}
                >
                  <DealActionTabs
                    activeTab={tabs.actionTabs.active}
                    derivedStatus={derivedStatus}
                    funding={funding}
                    isUpfrontDeal={!!pool.upfrontDeal}
                    pool={pool}
                  />
                </RequiredConnection>
              </NftSelectionProvider>
            </ActionTabs>
            <Vouch pool={pool} />
          </ActionsWrapper>
          {pool.hasNftList && <NftCollectionsTable pool={pool} />}
        </MainGrid>
        {showInvestorsModal && <InvestorsModal onClose={handleCloseInvestorsModal} pool={pool} />}
      </RightTimelineLayout>
    </>
  )
}

type DealActionTabsProps = {
  isUpfrontDeal: boolean
  pool: ParsedAelinPool
  activeTab: PoolAction | null
  derivedStatus: DerivedStatus
  funding: Funding
}
function DealActionTabs({ ...props }: DealActionTabsProps) {
  return props.isUpfrontDeal ? (
    <UpfrontDealActionTabs {...props} />
  ) : (
    <RegularPoolsActionTabs {...props} />
  )
}

function RegularPoolsActionTabs({ activeTab, derivedStatus, funding, pool }: DealActionTabsProps) {
  return (
    <>
      {!activeTab && <NoActions pool={pool} status={derivedStatus} />}
      {activeTab === PoolAction.Invest && <Invest pool={pool} poolHelpers={funding} />}
      {activeTab === PoolAction.AwaitingForDeal && <WaitingForDeal />}
      {activeTab === PoolAction.Withdraw && <WithdrawalFromPool pool={pool} />}
      {activeTab === PoolAction.CreateDeal && <CreateDeal pool={pool} />}
      {activeTab === PoolAction.AcceptDeal && <AcceptDeal pool={pool} />}
      {activeTab === PoolAction.FundDeal && <FundDeal pool={pool} />}
      {activeTab === PoolAction.Vest && <Vest pool={pool} />}
      {activeTab === PoolAction.WithdrawUnredeemed && <WithdrawUnredeemed pool={pool} />}
    </>
  )
}

function UpfrontDealActionTabs({ activeTab, derivedStatus, funding, pool }: DealActionTabsProps) {
  return (
    <>
      {!activeTab && <NoActions pool={pool} status={derivedStatus} />}
      {activeTab === PoolAction.DealInvest && (
        <InvestDirectDeal pool={pool} poolHelpers={funding} />
      )}
      {activeTab === PoolAction.AwaitingForDeal && (
        <WaitingForDeal isUpfrontDeal={!!pool.upfrontDeal} />
      )}
      {activeTab === PoolAction.FundDeal && <FundDeal pool={pool} />}
      {activeTab === PoolAction.Vest && <VestUpfrontDeal pool={pool} />}
      {activeTab === PoolAction.Settle && (
        <ClaimUpfrontDealTokens
          pool={pool}
          refund={derivedStatus.current === PoolStatus.Refunding}
        />
      )}
    </>
  )
}
