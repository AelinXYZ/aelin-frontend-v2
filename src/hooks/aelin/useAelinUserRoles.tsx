import { useMemo } from 'react'

import { getAddress } from '@ethersproject/address'
import { SWRConfiguration } from 'swr'

import { ParsedAelinPool } from './useAelinPool'
import useAelinUser from './useAelinUser'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { UserRole } from '@/types/aelinPool'

function useAelinUserRoles(pool: ParsedAelinPool, config?: SWRConfiguration): UserRole[] {
  const { address: userAddress } = useWeb3Connection()
  const { data: userResponse, error: errorUser } = useAelinUser(userAddress, config)

  if (errorUser) {
    throw new Error('Error getting user role')
  }

  const userRoles = useMemo<UserRole[]>(() => {
    if (userResponse && pool) {
      const roles: UserRole[] = []

      const isInvestor = userResponse.poolsInvested.some(
        ({ id }: { id: string }) => getAddress(id) === getAddress(pool.address),
      )

      const isSponsor = userResponse.poolsSponsored.some(
        ({ id }: { id: string }) => getAddress(id) === getAddress(pool.address),
      )

      const isHolder = userResponse.poolsAsHolder.some(
        ({ id }: { id: string }) => getAddress(id) === getAddress(pool.address),
      )

      if (isInvestor) roles.push(UserRole.Investor)
      if (isSponsor) roles.push(UserRole.Sponsor)
      if (isHolder) roles.push(UserRole.Holder)

      if (!roles.length) roles.push(UserRole.Visitor)

      return roles
    }

    return [UserRole.Visitor]
  }, [userResponse, pool])

  return userRoles
}

export default useAelinUserRoles
