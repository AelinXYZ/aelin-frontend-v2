import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { wei } from '@synthetixio/wei'
import isEmpty from 'lodash.isempty'
import ms from 'ms'

import useMerkleTreeData from '@/src/hooks/aelin/merkle-tree/useMerkleTreeData'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinUserRoles from '@/src/hooks/aelin/useAelinUserRoles'
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
  isElegible: boolean
  data: UserMerkleData
}

function useAelinUserMerkleTreeData(pool: ParsedAelinPool): MerkleTreeUserData | null {
  const { address: userAddress } = useWeb3Connection()
  const [userData, setUserData] = useState<MerkleTreeUserData | null>(null)
  const userRoles = useAelinUserRoles(pool, { refreshInterval: ms('5s') })

  const ipfsHash = pool.upfrontDeal?.ipfsHash || null

  const { data: merkleTreeData } = useMerkleTreeData({ ipfsHash, userAddress })

  const hasInvested = userRoles?.includes(UserRole.Investor)

  useEffect(() => {
    if (userAddress && !isEmpty(merkleTreeData) && merkleTreeData) {
      setUserData({
        isElegible: merkleTreeData.index >= 0,
        hasInvested,
        data: {
          index: merkleTreeData.index,
          account: userAddress,
          amount: wei(merkleTreeData.amount, pool.investmentTokenDecimals, true).toBN(),
          merkleProof: merkleTreeData.proof,
        },
      })
    }
  }, [pool, hasInvested, merkleTreeData, userAddress])

  return userData
}

export default useAelinUserMerkleTreeData
