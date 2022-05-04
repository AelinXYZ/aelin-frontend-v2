import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import Approve from '@/src/components/pools/actions/Approve'
import Deposit from '@/src/components/pools/actions/Deposit'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

const Invest: React.FC<Props> = ({ pool, poolHelpers, ...restProps }) => {
  return (
    <Wrapper title="Deposit tokens" {...restProps}>
      {!poolHelpers.userAllowance ? (
        <Contents>There was an error, try again!</Contents>
      ) : poolHelpers.capReached ? (
        <Contents>Max cap reached</Contents>
      ) : poolHelpers.userAllowance.gt(ZERO_ADDRESS) ? (
        <Deposit pool={pool} poolHelpers={poolHelpers} />
      ) : (
        <Approve
          pool={pool}
          refetchAllowance={poolHelpers.refetchUserAllowance}
          tokenAddress={pool.investmentToken}
          tokenSymbol={pool.investmentTokenSymbol}
        />
      )}
    </Wrapper>
  )
}

export default genericSuspense(Invest)
