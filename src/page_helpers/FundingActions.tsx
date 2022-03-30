import { ChainsValues } from '@/src/constants/chains'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import ApproveDeposit from '@/src/page_helpers/ApproveDeposit'
import { FundingState } from '@/src/utils/getAelinPoolCurrentStatus'

type Props = {
  chainId: ChainsValues
  pool: ParsedAelinPool
  poolHelpers: FundingState
}

export default function FundingActions({ chainId, pool, poolHelpers }: Props) {
  if (poolHelpers.meta.capReached) {
    return <div>Max cap reached</div>
  }

  return (
    <ApproveDeposit
      chainId={chainId}
      investmentToken={pool.investmentToken}
      investmentTokenDecimals={pool.investmentTokenDecimals}
    />
  )
}
