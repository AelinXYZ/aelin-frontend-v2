import { useMemo } from 'react'

import { ParsedAelinPool } from './useAelinPool'
import useAelinUser from './useAelinUser'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { UserRole } from '@/types/aelinPool'

type UserRoles = {
  userRoles: UserRole[]
  refetchUser: () => void
}

function useAelinUserRoles(pool: ParsedAelinPool): UserRoles {
  const { address: userAddress } = useWeb3Connection()

  const { data: userResponse, error: errorUser, mutate: refetchUser } = useAelinUser(userAddress)

  if (errorUser) {
    throw new Error('Error getting user role')
  }

  const userRoles = useMemo<UserRole[]>(() => {
    if (userResponse && pool) {
      const roles: UserRole[] = []
      const isInvestor = !!userResponse.poolsInvested.filter(
        ({ id }) => id.toLowerCase() === pool.address,
      ).length

      const isSponsor = !!userResponse.poolsSponsored.filter(
        ({ id }) => id.toLowerCase() === pool.address,
      ).length

      const isHolder = !!userResponse.poolsAsHolder.filter(
        ({ id }) => id.toLowerCase() === pool.address,
      ).length

      if (isInvestor) roles.push(UserRole.Investor)
      if (isSponsor) roles.push(UserRole.Sponsor)
      if (isHolder) roles.push(UserRole.Holder)
      if (!roles.length) roles.push(UserRole.Visitor)

      return roles
    }
    return [UserRole.Visitor]
  }, [userResponse, pool])
  return { userRoles, refetchUser }
}

export default useAelinUserRoles
