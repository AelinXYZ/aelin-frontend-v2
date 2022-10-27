import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import useAelinDirectDealCall from '@/src/hooks/contracts/useAelinDirectDealsCall'

export default function useAelinPoolAccess(
  dealAddress: string,
  chainId: ChainsValues,
  withinInterval: boolean,
): [boolean, () => void] {
  const [response, refetch] = useAelinDirectDealCall(
    chainId,
    dealAddress as string,
    'allowList',
    [],
    {
      ...(withinInterval && { refreshInterval: ms('5s') }),
    },
  )

  return [response as boolean, refetch]
}
