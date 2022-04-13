import styled from 'styled-components'

import isAfter from 'date-fns/isAfter'

import CountDown from '@/src/components/countdown'
import { CountDownDHMS } from '@/src/components/countdown/CountDownDHMS'
import { RightTimelineLayout } from '@/src/components/layout/RightTimelineLayout'
import CreateDealForm from '@/src/components/pools/CreateDealForm'
import FundingActions from '@/src/components/pools/FundingActions'
import DealInfo from '@/src/components/pools/poolDetails/DealInfo'
import PoolInfo from '@/src/components/pools/poolDetails/PoolInfo'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinPoolStatus from '@/src/hooks/aelin/useAelinPoolStatus'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { AelinPoolState, isFunding } from '@/src/utils/getAelinPoolCurrentStatus'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
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

  const showCreateDealForm =
    address?.toLowerCase() === pool.sponsor.toLowerCase() &&
    currentState.state === AelinPoolState.WaitingForDeal &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    !currentState?.meta.dealPresented

  return (
    <RightTimelineLayout timeline={<>Timeline stuff</>}>
      {!showCreateDealForm ? (
        <>
          <BaseCard>
            <Wrapper>
              <PoolInfo pool={pool} poolAddress={poolAddress} />

              {isFunding(currentState) && <FundingActions pool={pool} poolHelpers={currentState} />}
            </Wrapper>
          </BaseCard>
          <br />
          <BaseCard>
            <Wrapper>
              <DealInfo pool={pool} poolAddress={poolAddress} />
            </Wrapper>
          </BaseCard>
        </>
      ) : (
        <CreateDealForm pool={pool} />
      )}
    </RightTimelineLayout>
  )
}
