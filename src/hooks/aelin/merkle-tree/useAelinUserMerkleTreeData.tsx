import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { wei } from '@synthetixio/wei'
import ms from 'ms'

import { ParsedAelinPool } from '../useAelinPool'
import useAelinUserRoles from '../useAelinUserRoles'
import useMerkleTreeData from '../useMerkleTreeData'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isEmptyObject } from '@/src/utils/isEmptyObject'
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
  data: UserMerkleData
}

function useAelinUserMerkleTreeData(pool: ParsedAelinPool): MerkleTreeUserData | null {
  const { address: userAddress } = useWeb3Connection()
  const [userData, setUserData] = useState<MerkleTreeUserData | null>(null)
  const userRoles = useAelinUserRoles(pool, { refreshInterval: ms('5s') })

  const ipfsHash = pool.upfrontDeal?.ipfsHash || null
  const { data: merkleTreeData } = useMerkleTreeData({ ipfsHash })

  const hasInvested = userRoles?.includes(UserRole.Investor)

  const isEligible =
    !isEmptyObject(merkleTreeData) && !!userAddress && !!merkleTreeData?.claims?.[userAddress]

  useEffect(() => {
    if (userAddress && !isEmptyObject(merkleTreeData) && merkleTreeData) {
      setUserData({
        isEligible,
        hasInvested,
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
  }, [pool, hasInvested, isEligible, merkleTreeData, userAddress])

  return userData
}

export default useAelinUserMerkleTreeData
