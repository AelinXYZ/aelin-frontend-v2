import useVoucherAddress from './useVoucherAddress'
import { useEnsResolver } from '../../useEnsResolvers'
import useAelinUser from '../useAelinUser'
import env from '@/config/env'
import { OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useHardCodedVouchedPools from '@/src/hooks/aelin/useAelinHardCodedVouchedPools'

export default function useAelinVouchedPools() {
  const voucherAddress = useVoucherAddress()

  const { data: user, error, isValidating } = useAelinUser(voucherAddress || ZERO_ADDRESS)

  const { data: aelinVouchAddress } = useEnsResolver(
    env.NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS as string,
  )

  const isAelinVouchAddress =
    !voucherAddress ||
    (!!voucherAddress && !!aelinVouchAddress && voucherAddress === aelinVouchAddress)

  const {
    data: hardCodedVouchedPools,
    error: hdError,
    isValidating: isHdValidating,
  } = useHardCodedVouchedPools({
    orderBy: PoolCreated_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  })

  const vouchedPools = user?.poolsVouched ?? []

  return {
    data: [...(isAelinVouchAddress ? hardCodedVouchedPools ?? [] : []), ...vouchedPools],
    error: error || hdError,
    isValidating: isValidating || isHdValidating,
  }
}
