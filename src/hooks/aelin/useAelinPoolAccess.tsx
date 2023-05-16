import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import useAelinUpfrontDealCall, {
  AelinUpfrontDealCombined,
} from '@/src/hooks/contracts/useAelinUpfrontDealCall'

export default function useAelinPoolAccess(
  dealAddress: string,
  chainId: ChainsValues,
  withinInterval: boolean,
  isUpfrontDealTransferable: boolean,
): [boolean, () => void] {
  const method = 'allowList'

  const [response, refetch] = useAelinUpfrontDealCall(
    chainId,
    dealAddress as string,
    'allowList',
    [] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
    isUpfrontDealTransferable,
    {
      ...(withinInterval && { refreshInterval: ms('5s') }),
    },
  )

  return [response ?? false, refetch]
}
