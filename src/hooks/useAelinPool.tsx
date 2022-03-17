import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinPoolCall from '@/src/hooks/aelin/useAelinPoolCall'
import {
  getAmountFunded,
  getAmountInPool,
  getAmountWithdrawn,
  getDealDeadline,
  getPoolCreatedDate,
  getPurchaseExpiry,
} from '@/src/utils/aelinPool'
import getAllGqlSDK from '@/src/utils/getAllGqlSDK'

export default function useAelinPool(chainId: ChainsValues, poolAddress: string) {
  const allSDK = getAllGqlSDK()
  const { usePoolById } = allSDK[chainId]
  const { data } = usePoolById({ poolCreatedId: poolAddress })
  const [poolTotalWithdrawn] = useAelinPoolCall(chainId, poolAddress, 'totalAmountWithdrawn', [])

  if (!data?.poolCreated) {
    throw Error('There was not possible to fetch pool id: ' + poolAddress)
  }

  if (!poolTotalWithdrawn) {
    throw Error('There was not possible to fetch poolTotalWithdrawn: ' + poolAddress)
  }

  const pool = data.poolCreated
  const purchaseTokenDecimals = pool.purchaseTokenDecimals
  // prevent TS error
  if (!purchaseTokenDecimals) {
    throw Error('PurchaseTokenDecimals is null or undefined for pool: ' + poolAddress)
  }

  return {
    start: getPoolCreatedDate(pool),
    purchaseExpiry: getPurchaseExpiry(pool),
    dealDeadline: getDealDeadline(pool),
    amountInPool: getAmountInPool({ ...pool, purchaseTokenDecimals }),
    funded: getAmountFunded({ ...pool, purchaseTokenDecimals }),
    withdrawn: getAmountWithdrawn(poolTotalWithdrawn || ZERO_BN),
  }
}
