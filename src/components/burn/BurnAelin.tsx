import styled from 'styled-components'

import MintNft from './MintNft'
import NoBalance from './NoBalance'
import Success from './Success'
import SwapTokens from './SwapTokens'
import { CardTitle, CardWithTitle } from '../common/CardWithTitle'
import Approve from '../pools/actions/Approve'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { contracts } from '@/src/constants/contracts'
import { BURN_AELIN_CONTRACT } from '@/src/constants/misc'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { BurnAelinState, useBurnAelin } from '@/src/providers/burnAelinProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const BodyWrapper = styled.div`
  padding: 30px 20px 40px;
`

const Card = styled(CardWithTitle)`
  width: 500px;
`

const BurnAelin: React.FC = () => {
  const { appChainId } = useWeb3Connection()

  const { refetchUserAllowance, state, userBalance } = useBurnAelin()

  const tokenAddress = contracts.AELIN_TOKEN.address[appChainId]

  return (
    <MainWrapper>
      <Card titles={<CardTitle>Swap/Burn AELIN Tokens</CardTitle>}>
        <RequiredConnection
          isNotConnectedText="Connect your wallet"
          isWrongNetworkText="Wrong network"
          minHeight={175}
          networkToCheck={10}
        >
          <BodyWrapper>
            {state === BurnAelinState.MINT ? (
              <MintNft />
            ) : state === BurnAelinState.NO_BALANCE ? (
              <NoBalance />
            ) : state === BurnAelinState.APPROVE ? (
              <Approve
                allowance={formatToken(userBalance, 18, 4)}
                description="Approve your AELIN tokens to be moved by our swap contract"
                refetchAllowance={refetchUserAllowance}
                spender={BURN_AELIN_CONTRACT}
                symbol="AELIN"
                title="Approve AELIN tokens"
                tokenAddress={tokenAddress}
              />
            ) : state === BurnAelinState.SWAP ? (
              <SwapTokens />
            ) : state === BurnAelinState.SUCCESS ? (
              <Success />
            ) : (
              <div>Fetching data...</div>
            )}
          </BodyWrapper>
        </RequiredConnection>
      </Card>
    </MainWrapper>
  )
}

export default genericSuspense(BurnAelin)
