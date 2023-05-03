import { useEffect, useState } from 'react'

import { getAddress } from '@ethersproject/address'

import useAelinVouchedPools from '@/src/hooks/aelin/vouched-pools/useAelinVouchedPools'

export default function useIsPoolVouchedByAddress(poolAddress: string) {
  const [isVouched, setIsVouched] = useState<boolean>(false)
  const { data: vouchedPools, error, isValidating } = useAelinVouchedPools()

  useEffect(() => {
    if (vouchedPools && !isValidating) {
      setIsVouched(
        vouchedPools.some((pool) => getAddress(pool.address) === getAddress(poolAddress)),
      )
    }
  }, [vouchedPools, poolAddress, isValidating])

  return {
    isVouched,
    error,
    isValidating,
  }
}
