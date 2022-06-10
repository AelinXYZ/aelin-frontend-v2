import { BigNumber } from '@ethersproject/bignumber'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import Approve from '@/src/components/pools/actions/Approve'
import Deposit from '@/src/components/pools/actions/Deposit'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useUserAvailableToDeposit } from '@/src/hooks/aelin/useUserAvailableToDeposit'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
  userPoolBalance: BigNumber | null
  refetchUserPoolBalance: () => void
}

const Invest: React.FC<Props> = ({
  pool,
  poolHelpers,
  refetchUserPoolBalance,
  userPoolBalance,
  ...restProps
}) => {
  const { address } = useWeb3Connection()
  const [userAllowance, refetchUserAllowance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'allowance',
    [address || ZERO_ADDRESS, pool.address],
  )
  const { isUserAllowedToInvest, userAlreadyInvested } = useUserAvailableToDeposit(
    pool,
    userPoolBalance,
    refetchUserPoolBalance,
  )

  return (
    <Wrapper title="Deposit tokens" {...restProps}>
      {!userAllowance ? (
        <Contents>There was an error, try again!</Contents>
      ) : poolHelpers.capReached ? (
        <Contents>Max cap reached</Contents>
      ) : !isUserAllowedToInvest ? (
        <Contents>The connected wallet was not whitelisted to invest in this pool.</Contents>
      ) : userAlreadyInvested ? (
        <Contents>This address have already invested in this pool.</Contents>
      ) : userAllowance.gt(ZERO_ADDRESS) ? (
        <Deposit
          pool={pool}
          poolHelpers={poolHelpers}
          refetchUserPoolBalance={refetchUserPoolBalance}
          userPoolBalance={userPoolBalance}
        />
      ) : (
        <Approve
          description={`Before you can deposit, the pool needs your permission to transfer your ${pool.investmentTokenSymbol}`}
          refetchAllowance={refetchUserAllowance}
          spender={pool.address}
          title="Deposit tokens"
          tokenAddress={pool.investmentToken}
        />
      )}
    </Wrapper>
  )
}

export default genericSuspense(Invest)
