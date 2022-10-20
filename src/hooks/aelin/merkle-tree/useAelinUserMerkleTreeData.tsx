import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { wei } from '@synthetixio/wei'

import { ParsedAelinPool } from '../useAelinPool'
import useAelinUserRoles from '../useAelinUserRoles'
import useMerkleTreeData from '../useMerkleTreeData'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { UserRole } from '@/types/aelinPool'

export type UserMerkleData = {
  index: number
  account: string
  amount: BigNumber
  merkleProof: string[]
}

export type MerkleTreeUserData = {
  hasInvested: boolean
  isEligible: boolean
  refetchUser: () => void
  data: UserMerkleData
}

function useAelinUserMerkleTreeData(pool: ParsedAelinPool): MerkleTreeUserData | null {
  const { address: userAddress } = useWeb3Connection()
  const [userData, setUserData] = useState<MerkleTreeUserData | null>(null)
  const { refetchUser, userRoles } = useAelinUserRoles(pool)

  const ipfsHash = pool.upfrontDeal?.ipfsHash || null
  const { data: merkleTreeData } = useMerkleTreeData({ ipfsHash })

  const hasInvested = userRoles?.includes(UserRole.Investor)
  const isEligible = !!userAddress && !!merkleTreeData?.claims?.[userAddress]

  useEffect(() => {
    if (userAddress && merkleTreeData) {
      setUserData({
        isEligible,
        hasInvested,
        refetchUser,
        data: {
          index: merkleTreeData.claims[userAddress].index,
          account: userAddress,
          amount: wei(
            merkleTreeData.claims[userAddress].amount,
            pool.investmentTokenDecimals,
            true,
          ).toBN(),
          merkleProof: merkleTreeData.claims[userAddress].proof,
        },
      })
    }
  }, [pool, hasInvested, isEligible, merkleTreeData, userAddress, refetchUser])

  return userData
}

export default useAelinUserMerkleTreeData
