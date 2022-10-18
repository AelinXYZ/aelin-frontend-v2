import useSWR from 'swr'

import { MerkleDistributorInfo } from '@/src/utils/merkle-tree/parse-balance-map'

type Props = {
  ipfsHash: string
}

const getMerkleTreeIpfsGatewayUrl = (ipfsHash: string) =>
  `https://${process.env.NEXT_PUBLIC_IPFS_GATEWAY_BASE_URL}/${ipfsHash}`

const useMerkleTreeData = (variables: Props) => {
  return useSWR<MerkleDistributorInfo, Error>(
    'merkle-tree-data',
    async () => {
      const url = getMerkleTreeIpfsGatewayUrl(variables.ipfsHash)

      const response = await fetch(url)
      const merkleTreeDataJson = await response.json()

      return merkleTreeDataJson
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  )
}

export default useMerkleTreeData
