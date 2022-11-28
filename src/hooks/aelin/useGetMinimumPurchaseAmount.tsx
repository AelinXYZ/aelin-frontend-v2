import useSWR from 'swr'

const MINIMUM_PURCHASE_AMOUNT_ENDPOINT = '/data/minimum-purchase-amount.json'

export const fetchMinimumPurchaseAmount = async () => {
  try {
    const response = await fetch(MINIMUM_PURCHASE_AMOUNT_ENDPOINT)

    return response.json()
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
