import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import InlineLoading from '@/src/components/pureStyledComponents/common/InlineLoading'
import { DISPLAY_DECIMALS, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

type Props = {
  pool: ParsedAelinPool
}

function UserInvestmentTokenBalance({ pool }: Props) {
  const { address, isWalletConnected } = useWeb3Connection()
  const [userInvestmentTokenBalance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'balanceOf',
    [address || ZERO_ADDRESS],
  )
  return (
    <>
      {isWalletConnected
        ? formatToken(
            userInvestmentTokenBalance || ZERO_BN,
            pool.investmentTokenDecimals,
            DISPLAY_DECIMALS,
          ) || 0
        : 0}{' '}
      {pool.investmentTokenSymbol}
    </>
  )
}

export default genericSuspense(UserInvestmentTokenBalance, () => <InlineLoading />)
