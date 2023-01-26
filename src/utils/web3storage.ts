import { Web3Storage } from 'web3.storage'

import env from '@/config/env'
import { MerkleDistributorInfo } from '@/src/utils/merkle-tree/parse-balance-map'

const client = new Web3Storage({ token: env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN_KEY as string })

const _makeFileObjects = (merkleTreeData: MerkleDistributorInfo, fileName: string) => {
  const blob = new Blob([JSON.stringify(merkleTreeData)], { type: 'application/json' })

  return [new File([blob], fileName)]
}

export const storeJson = async (merkleTreeData: MerkleDistributorInfo, fileName: string) => {
  const files = _makeFileObjects(merkleTreeData, fileName)

  const promisePut = new Promise<string>((resolve, reject) => {
    try {
      return client.put(files, {
        name: fileName,
        wrapWithDirectory: false,
        onRootCidReady(ipfsHash) {
          resolve(ipfsHash)
        },
      })
    } catch (err) {
      reject(err)
    }
  })

  const ipfsHash = await promisePut

  return ipfsHash
}
