import useAelinUser from '../useAelinUser'
import useVoucherAddress, { useAelinVouchAddress } from './useVoucherAddress'
import { OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'
import useHardCodedVouchedPools from '@/src/hooks/aelin/useAelinHardCodedVouchedPools'

export default function useAelinVouchedPools() {
  const voucherAddress = useVoucherAddress()
  const { data: user, error, isValidating } = useAelinUser(voucherAddress)
  const aelinVouchAddress = useAelinVouchAddress()

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
