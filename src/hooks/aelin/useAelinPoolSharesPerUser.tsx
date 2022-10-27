import ms from 'ms'

import useAelinUpfrontDealCall from '../contracts/useAelinUpfrontDealCall'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getDetailedNumber } from '@/src/utils/aelinPoolUtils'
import { DetailedNumber } from '@/types/utils'

export default function useAelinPoolSharesPerUser(
  upfrontDealAddress: string,
  dealTokenDecimals: number,
  chainId: ChainsValues,
  withinInterval: boolean,
): [DetailedNumber, () => void] {
  const { address } = useWeb3Connection()

  const [response, refetch] = useAelinUpfrontDealCall(
    chainId,
    upfrontDealAddress as string,
    'poolSharesPerUser',
    [address || ZERO_ADDRESS],
    {
      ...(withinInterval && { refreshInterval: ms('5s') }),
    },
  )

  if (!response) return [{ raw: ZERO_BN, formatted: '0' }, refetch]

  return [getDetailedNumber(response.toString(), dealTokenDecimals), refetch]
}
