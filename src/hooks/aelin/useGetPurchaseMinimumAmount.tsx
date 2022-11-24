import useSWR from 'swr'

const PURCHASE_MINIMUM_AMOUNT_ENDPOINT = '/data/minimum-purchase.json'

export const getPurchaseMinimumAmount = async () => {
  try {
    const response = await fetch(PURCHASE_MINIMUM_AMOUNT_ENDPOINT)

    return response.json()
  } catch (e) {
    console.error('error: ', e)
    return {}
  }
}

export const useGetPurchaseMinimumAmount = () => {
  return useSWR(
    ['purchase-minimum'],
    async () => {
      const purchaseMinimumAmount = await getPurchaseMinimumAmount()

      return purchaseMinimumAmount
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  )
}

export default useGetPurchaseMinimumAmount
