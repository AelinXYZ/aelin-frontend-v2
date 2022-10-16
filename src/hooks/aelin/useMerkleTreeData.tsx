import useSWR from 'swr'

import { MerkleDistributorInfo } from '@/src/utils/merkle-tree/parse-balance-map'

type Props = {
  cid: string
}

const getMerkleTreeIpfsGatewayUrl = (cid: string) =>
  `https://${process.env.NEXT_PUBLIC_IPFS_GATEWAY_BASE_URL}/${cid}`

const useMerkleTreeData = (variables: Props) => {
  return useSWR<MerkleDistributorInfo, Error>(
    'merkle-tree-data',
    async () => {
      const url = getMerkleTreeIpfsGatewayUrl(variables.cid)

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
