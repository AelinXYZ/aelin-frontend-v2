import { genericSuspense } from '../../helpers/SafeSuspense'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinDealCall from '@/src/hooks/contracts/useAelinDealCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DerivedStatus, PoolStatus } from '@/types/aelinPool'

const NoActions = ({ pool, status }: { status: DerivedStatus; pool: ParsedAelinPool }) => {
  const { address, appChainId } = useWeb3Connection()

  const [dealTokenBalance] = useAelinDealCall(
    appChainId,
    pool.dealAddress || ZERO_ADDRESS,
    'balanceOf',
    [address || ZERO_ADDRESS],
  )
  return (
    <div>
      {status.current === PoolStatus.DealPresented
        ? dealTokenBalance?.gt(ZERO_BN)
          ? 'You have accepted your full allocation'
          : 'You have not participated in this pool'
        : 'No actions available'}
    </div>
  )
}

export default genericSuspense(NoActions)
