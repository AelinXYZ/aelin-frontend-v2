import useSWR from 'swr'

import minimumPurchaseAmount from '@/public/data/minimum-purchase-amount.json'

export const fetchMinimumPurchaseAmount = async () => {
  try {
    return minimumPurchaseAmount
  } catch (e) {
    console.error('error: ', e)
    return {}
  }
}

export const useGetMinimumPurchaseAmount = () => {
  return useSWR(
    ['purchase-minimum'],
    async () => {
      const purchaseMinimumAmount = await fetchMinimumPurchaseAmount()

      return purchaseMinimumAmount
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  )
}

export default useGetMinimumPurchaseAmount
