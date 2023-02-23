import { createContext, useContext, useEffect, useState } from 'react'

import { ZERO_ADDRESS } from '../constants/misc'
import useAelinHardCodedVouchedPools from '../hooks/aelin/useAelinHardCodedVouchedPools'
import { ParsedAelinPool } from '../hooks/aelin/useAelinPool'
import useAelinUser from '../hooks/aelin/useAelinUser'
import useVoucherAddress from '../hooks/aelin/vouched-pools/useVoucherAddress'
import { useEnsResolver } from '../hooks/useEnsResolvers'
import env from '@/config/env'
import { OrderDirection, PoolCreated_OrderBy } from '@/graphql-schema'

export type VouchedPoolsContextType = {
  vouchedPools: ParsedAelinPool[]
  hardcodedVouchedPools: ParsedAelinPool[]
}

const VouchedPoolsContext = createContext<VouchedPoolsContextType>({} as any)

const VouchedPoolsContextProvider: React.FC = ({ children }) => {
  const [vouchedPools, setVouchedPools] = useState<ParsedAelinPool[]>([])
  const [hardcodedVouchedPools, setHardcodedVouchedPools] = useState<ParsedAelinPool[]>([])

  const voucherAddress = useVoucherAddress()

  const { data: aelinVouchAddress } = useEnsResolver(
    env.NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS as string,
  )

  const { data: user } = useAelinUser(voucherAddress || ZERO_ADDRESS)

  const { data: hardCodedVouchedPools } = useAelinHardCodedVouchedPools({
    orderBy: PoolCreated_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  })

  useEffect(() => {
    if (user?.poolsVouched) {
      setVouchedPools(user?.poolsVouched as ParsedAelinPool[])
    } else {
      setVouchedPools([])
    }
  }, [user?.poolsVouched])

  useEffect(() => {
    const isAelinVouchAddress =
      !voucherAddress ||
      (!!voucherAddress && !!aelinVouchAddress && voucherAddress === aelinVouchAddress)

    if (isAelinVouchAddress) {
      setHardcodedVouchedPools(hardCodedVouchedPools as ParsedAelinPool[])
    } else {
      setHardcodedVouchedPools([])
    }
  }, [aelinVouchAddress, hardCodedVouchedPools, voucherAddress])

  return (
    <VouchedPoolsContext.Provider
      value={{
        vouchedPools,
        hardcodedVouchedPools,
      }}
    >
      {children}
    </VouchedPoolsContext.Provider>
  )
}

export default VouchedPoolsContextProvider

export function useVouchedPools(): VouchedPoolsContextType {
  const context = useContext(VouchedPoolsContext)

  if (!context) {
    throw new Error('Error on vouched pools context')
  }

  return context
}
