import * as isIPFS from 'is-ipfs'
import useSWR from 'swr'

import { MerkleDistributorInfo } from '@/src/utils/merkle-tree/parse-balance-map'

type Props = {
  ipfsHash: string
}

const getMerkleTreeIpfsGatewayUrl = (ipfsHash: string) =>
  `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_BASE_URL}/${ipfsHash}`

const useMerkleTreeData = (variables: Props) => {
  return useSWR<MerkleDistributorInfo, Error>(
    'merkle-tree-data',
    async () => {
      try {
        if (!isIPFS.cid(variables.ipfsHash)) throw new Error('Invalid ipfs hash')

        const url = getMerkleTreeIpfsGatewayUrl(variables.ipfsHash)

        const response = await fetch(url)
        const merkleTreeDataJson = await response.json()

        return merkleTreeDataJson
      } catch (err) {
        console.error(err)
        return {}
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  )
}

export default useMerkleTreeData
