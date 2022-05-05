import { ZERO_ADDRESS } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolCall from '@/src/hooks/contracts/useAelinPoolCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { AelinPool } from '@/types/typechain/AelinPool'

export function useProRataAmount(pool: ParsedAelinPool) {
  const { address } = useWeb3Connection()

  const [maxProRataAmountBalance, refetchMaxProRataAmountBalance] = useAelinPoolCall(
    pool.chainId,
    pool.address,
    (pool.deal?.redemption?.stage === 1
      ? 'maxProRataAmount'
      : 'maxOpenAvail') as keyof AelinPool['functions'],
    [address || ZERO_ADDRESS],
  )

  return {
    maxProRataAmountBalance,
    refetchMaxProRataAmountBalance,
  }
}
