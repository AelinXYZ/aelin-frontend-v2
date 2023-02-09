import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { isValidAddress } from 'ethereumjs-util'

import { isValidENSName, useEnsResolver } from '../../useEnsResolvers'
import { ZERO_ADDRESS } from '@/src/constants/misc'

export default function useVoucherAddress() {
  const {
    query: { voucher },
  } = useRouter()

  const [voucherAddress, setVoucherAddress] = useState<string | null>(null)
  const { data: aelinVouchAddress } = useEnsResolver(
    process.env.NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS as string,
  )
  const { data: ensAddress } = useEnsResolver(voucher as string)
  const { data: ensDotEthAddress } = useEnsResolver(voucher + '.eth')

  useEffect(() => {
    if (!voucher || typeof voucher !== 'string') {
      setVoucherAddress(aelinVouchAddress ?? null)
    } else if (isValidAddress(voucher)) {
      setVoucherAddress(voucher)
    } else if (isValidENSName(voucher) && ensAddress) {
      setVoucherAddress(ensAddress)
    } else if (isValidENSName(voucher + '.eth') && ensDotEthAddress) {
      setVoucherAddress(ensDotEthAddress)
    } else {
      setVoucherAddress(ZERO_ADDRESS)
    }
  }, [voucher, voucherAddress, aelinVouchAddress, ensAddress, ensDotEthAddress])

  return voucherAddress
}
