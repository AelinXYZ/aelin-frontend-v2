import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { isValidAddress } from 'ethereumjs-util'

import { ensResolver, isValidENSName } from '../../useEnsResolvers'
import { ZERO_ADDRESS } from '@/src/constants/misc'

export default function useVoucherAddress() {
  const {
    query: { voucher },
  } = useRouter()

  const [voucherAddress, setVoucherAddress] = useState<string | null>(null)
  const aelinVouchAddress = useAelinVouchAddress()

  useEffect(() => {
    if (!voucher || typeof voucher !== 'string') {
      setVoucherAddress(aelinVouchAddress)
    } else if (isValidAddress(voucher)) {
      setVoucherAddress(voucher)
    } else if (isValidENSName(voucher)) {
      ensResolver(voucher).then(setVoucherAddress)
    } else {
      setVoucherAddress(ZERO_ADDRESS)
    }
  }, [voucher, voucherAddress, aelinVouchAddress])

  return voucherAddress
}

export function useAelinVouchAddress() {
  const [voucherAddress, setVoucherAddress] = useState<string | null>(null)

  useEffect(() => {
    ensResolver(process.env.NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS as string).then(setVoucherAddress)
  }, [])

  return voucherAddress
}
