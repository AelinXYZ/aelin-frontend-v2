import * as isIPFS from 'is-ipfs'
import useSWR from 'swr'
import { Web3Storage } from 'web3.storage'

import { MerkleDistributorInfo } from '@/src/utils/merkle-tree/parse-balance-map'

type Props = {
  ipfsHash: string | null
}

const getMerkleTreeIpfsGatewayUrl = (ipfsHash: string) =>
  `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_BASE_URL}/${ipfsHash}`

const useMerkleTreeData = (variables: Props) => {
  return useSWR<MerkleDistributorInfo, Error>(
    'merkle-tree-data',
    async () => {
      try {
        if (!variables.ipfsHash) return {}

        if (!isIPFS.cid(variables.ipfsHash)) throw new Error('Invalid ipfs hash')

        const client = new Web3Storage({
          token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN_KEY as string,
        })

        const res = await client.get(variables.ipfsHash)

        if (!res?.ok) throw new Error('Unexpected fetch response')

        const files = await res?.files()

        const merkleTreeDataJson = JSON.parse(await files[0].text())

        return merkleTreeDataJson
      } catch (err) {
        console.error(err)

        // Fallback to link fetching
        if (!variables.ipfsHash) return {}

        try {
          const response = await fetch(getMerkleTreeIpfsGatewayUrl(variables.ipfsHash))
          const merkleTreeDataJson = await response.json()
          return merkleTreeDataJson
        } catch (err) {
          console.log(err)
          return {}
        }
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  )
}

export default useMerkleTreeData
