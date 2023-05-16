import { useEnsResolver } from '../../useEnsResolvers'
import { ParsedAelinPool } from '../useAelinPool'
import useAelinUser from '../useAelinUser'
import env from '@/config/env'
import { OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'
import { Chains } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import useHardCodedVouchedPools from '@/src/hooks/aelin/useAelinHardCodedVouchedPools'
import useVoucherAddress from '@/src/hooks/aelin/vouched-pools/useVoucherAddress'
import useIsMultisigOnMainnet from '@/src/hooks/useIsMultisigOnMainnet'

export default function useAelinVouchedPools() {
  const voucherAddress = useVoucherAddress()

  const { data: user, error, isValidating } = useAelinUser(voucherAddress || ZERO_ADDRESS)

  const { data: aelinVouchAddress } = useEnsResolver(
    env.NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS as string,
  )

  const {
    data: isMultisigOnMainnet,
    error: multisigError,
    isValidating: isMultisigValidating,
  } = useIsMultisigOnMainnet(voucherAddress as string)

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

  let vouchedPools: ParsedAelinPool[] = []

  if (user) {
    vouchedPools = user?.poolsVouched

    if (isMultisigOnMainnet) {
      vouchedPools = user.poolsVouched.filter(
        (pool: ParsedAelinPool) => pool.chainId === Chains.mainnet,
      )
    }
  }

  return {
    data: [...(isAelinVouchAddress ? hardCodedVouchedPools ?? [] : []), ...vouchedPools],
    error: error || hdError || multisigError,
    isValidating: isValidating || isHdValidating || isMultisigValidating,
  }
}
