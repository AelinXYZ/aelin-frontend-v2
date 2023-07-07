import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinDealCall, { AelinDealCombined } from '@/src/hooks/contracts/useAelinDealCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { DerivedStatus, PoolStatus } from '@/types/aelinPool'

const NoActions = ({ pool, status }: { status: DerivedStatus; pool: ParsedAelinPool }) => {
  const { address, appChainId } = useWeb3Connection()

  const method = 'balanceOf'

  const [dealTokenBalance] = useAelinDealCall(
    appChainId,
    pool.dealAddress || ZERO_ADDRESS,
    method,
    [address || ZERO_ADDRESS] as Parameters<AelinDealCombined['functions'][typeof method]>,
    pool.isDealTokenTransferable,
  )

  return (
    <div>
      {status.current === PoolStatus.DealPresented
        ? (dealTokenBalance ?? ZERO_BN).gt(ZERO_BN)
          ? 'You have accepted your full allocation'
          : 'You have not participated in this pool'
        : 'No actions available'}
    </div>
  )
}

export default genericSuspense(NoActions)
