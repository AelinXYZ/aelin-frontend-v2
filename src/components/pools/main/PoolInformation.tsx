import styled, { keyframes } from 'styled-components'

import { genericSuspense } from '../../helpers/SafeSuspense'
import { TokenIcon } from '../common/TokenIcon'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Deadline } from '@/src/components/common/Deadline'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { formatToken } from '@/src/web3/bigNumber'
import { Funding } from '@/types/aelinPool'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`
const loadingAnimation = keyframes`
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
`

const Loading = styled.div`
  animation-delay: 0;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: ${loadingAnimation};
  animation-timing-function: ease-in-out;
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
`

const SuspenseValue: React.FC<{
  pool: ParsedAelinPool
}> = genericSuspense(
  ({ pool }) => {
    const { address } = useWeb3Connection()
    const [userInvestmentTokenBalance] = useERC20Call(
      pool.chainId,
      pool.investmentToken,
      'balanceOf',
      [address || ZERO_ADDRESS],
    )
    return (
      <>
        {formatToken(userInvestmentTokenBalance || ZERO_BN, pool.investmentTokenDecimals) || 0}{' '}
        {pool.investmentTokenSymbol}
      </>
    )
  },
  () => <Loading>Loading...</Loading>,
)

export const PoolInformation: React.FC<{
  pool: ParsedAelinPool
  poolStatusHelper: Funding
}> = ({ pool, poolStatusHelper }) => {
  return (
    <>
      <Column>
        <InfoCell
          title="Investment token"
          tooltip="The currency used to purchase pool tokens"
          value={
            <TokenIcon
              address={pool.investmentToken}
              network={pool.chainId}
              symbol={pool.investmentTokenSymbol}
              type="row"
            />
          }
        />
        <InfoCell
          title="Pool cap"
          tooltip="Maximum number of Investment tokens"
          value={pool.poolCap.raw.eq(ZERO_BN) ? 'Uncapped' : pool.poolCap.formatted}
        />
        <InfoCell
          title="Pool stats"
          tooltip="The total amount of tokens all purchasers have deposited, withdrawn and the remaining amount in the pool"
        >
          <Value>Funded: {pool.funded.formatted}</Value>
          <Value>Withdrawn: {pool.withdrawn.formatted}</Value>
          <Value>Amount in Pool: {pool.amountInPool.formatted}</Value>
        </InfoCell>
        <InfoCell
          title={`My ${pool.investmentTokenSymbol} balance`}
          value={<SuspenseValue pool={pool} />}
        />
        <InfoCell
          title="My pool balance"
          tooltip="The number of purchase tokens you have deposited"
          value={`${poolStatusHelper.poolTokenBalance.formatted || 0} ${
            pool.investmentTokenSymbol
          }`}
        />
      </Column>
      <Column>
        <InfoCell
          title="Investment deadline"
          tooltip="The amount of time investors have to deposit Investment tokens"
        >
          <Deadline
            progress={calculateDeadlineProgress(pool.purchaseExpiry, pool.start)}
            width="180px"
          >
            <Value>{formatDate(pool.purchaseExpiry, DATE_DETAILED)}</Value>
          </Deadline>
        </InfoCell>
        <InfoCell
          title="Deal deadline"
          tooltip="The amount of time a sponsor has to find a deal before investors can withdraw their funds. A deal may still be created after the deadline if funds are still in the pool."
          value={formatDate(pool.dealDeadline, DATE_DETAILED)}
        />
        <InfoCell
          title="Sponsor"
          tooltip="The sponsor will seek a deal on behalf of purchasers entering this pool"
          value={<ENSOrAddress address={pool.sponsor} network={pool.chainId} />}
        />
        <InfoCell
          title="Sponsor fee"
          tooltip="The fee paid to the sponsor for each deal token redeemed, paid in deal tokens"
          value={pool.sponsorFee.formatted}
        />
      </Column>
    </>
  )
}

export default PoolInformation
