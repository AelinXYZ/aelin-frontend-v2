import useAelinUser from '../useAelinUser'
import useVoucherAddress from './useVoucherAddress'
import { OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'
import useHardCodedVouchedPools from '@/src/hooks/aelin/useAelinHardCodedVouchedPools'

export default function useAelinVouchedPools() {
  const voucherAddress = useVoucherAddress()
  const { data: user, error, isValidating } = useAelinUser(voucherAddress)

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
    data: [...(hardCodedVouchedPools || []), ...vouchedPools],
    error: error || hdError,
    isValidating: isValidating || isHdValidating,
  }
}
