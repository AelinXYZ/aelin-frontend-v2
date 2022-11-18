import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { isValidAddress } from 'ethereumjs-util'

import { ensResolver, isValidENSName } from '../../useEnsResolvers'

export default function useVoucherAddress() {
  const {
    query: { voucher },
  } = useRouter()

  const [voucherAddress, setVoucherAddress] = useState<string | null>(null)

  useEffect(() => {
    if (!voucher || typeof voucher !== 'string') {
      setVoucherAddress(process.env.NEXT_PUBLIC_AELIN_VOUCHER_ADDRESS as string)
    } else if (isValidAddress(voucher)) {
      setVoucherAddress(voucher)
    } else if (isValidENSName(voucher)) {
      ensResolver(voucher).then(setVoucherAddress)
    } else {
      setVoucherAddress(process.env.NEXT_PUBLIC_AELIN_VOUCHER_ADDRESS as string)
    }
  }, [voucher, voucherAddress])

  return voucherAddress
}
