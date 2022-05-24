import styled from 'styled-components'

import { TokenIcon } from '../common/TokenIcon'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Deadline } from '@/src/components/common/Deadline'
import { InfoCell, Value } from '@/src/components/pools/common/InfoCell'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'
import { Funding } from '@/types/aelinPool'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 20px;
`

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
          value={poolStatusHelper.userInvestmentTokenBalance.formatted}
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
