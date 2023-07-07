import ms from 'ms'

import { ChainsValues } from '@/src/constants/chains'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useAelinUpfrontDealCall, {
  AelinUpfrontDealCombined,
} from '@/src/hooks/contracts/useAelinUpfrontDealCall'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getDetailedNumber } from '@/src/utils/aelinPoolUtils'
import { DetailedNumber } from '@/types/utils'

export default function useAelinPoolSharesPerUser(
  upfrontDealAddress: string,
  dealTokenDecimals: number,
  chainId: ChainsValues,
  withinInterval: boolean,
  isDealTokenTransferable: boolean,
): [DetailedNumber, () => void] {
  const { address } = useWeb3Connection()

  const method = 'poolSharesPerUser'

  const [response, refetch] = useAelinUpfrontDealCall(
    chainId,
    upfrontDealAddress as string,
    method,
    [address || ZERO_ADDRESS] as Parameters<AelinUpfrontDealCombined['functions'][typeof method]>,
    isDealTokenTransferable,
    {
      ...(withinInterval && { refreshInterval: ms('5s') }),
    },
  )

  if (!response) return [{ raw: ZERO_BN, formatted: '0' }, refetch]

  return [getDetailedNumber(response, dealTokenDecimals), refetch]
}
