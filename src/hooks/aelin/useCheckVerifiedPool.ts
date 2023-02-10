import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinVouchedPools from '@/src/hooks/aelin/vouched-pools/useAelinVouchedPools'

export const useCheckVerifiedPool = (pool: ParsedAelinPool) => {
  const { data, error } = useAelinVouchedPools()

  if (error) {
    return false
  }

  if (!data || !data.length) return false

  return data.some((verifiedPool) => verifiedPool.address === pool.address)
}
