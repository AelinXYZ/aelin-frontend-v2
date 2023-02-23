import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { isAddress } from '@ethersproject/address'

import env from '@/config/env'
import { isValidENSName, useEnsResolver } from '@/src/hooks/useEnsResolvers'

export default function useVoucherAddress() {
  const [voucherAddress, setVoucherAddress] = useState<string | null>(null)

  const {
    query: { voucher },
  } = useRouter()

  const formattedVoucher =
    voucher && typeof voucher === 'string'
      ? isAddress(voucher)
        ? voucher
        : voucher.endsWith('.eth')
        ? voucher
        : `${voucher}.eth`
      : env.NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS

  const { data: ensAddress } = useEnsResolver(formattedVoucher as string)

  useEffect(() => {
    function getVoucherAddress(): string {
      if (isAddress(formattedVoucher as string)) {
        return formattedVoucher as string
      }

      if (isValidENSName(formattedVoucher as string) && ensAddress) {
        return ensAddress
      }

      return env.NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS as string
    }

    setVoucherAddress(getVoucherAddress())
  }, [voucher, voucherAddress, ensAddress, formattedVoucher])

  return voucherAddress
}
