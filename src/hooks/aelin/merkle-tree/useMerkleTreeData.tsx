import * as isIPFS from 'is-ipfs'
import useSWR from 'swr'
import { Web3Storage } from 'web3.storage'

import { promisifyWorker } from '@/src/utils/promisifyWorker'

type Props = {
  ipfsHash: string | null
  userAddress: string | null
}

const fetcher = async (variables: Props) => {
  try {
    if (!variables.ipfsHash) return {}

    if (!isIPFS.cid(variables.ipfsHash)) throw new Error('Invalid ipfs hash')

    const client = new Web3Storage({
      token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN_KEY as string,
    })

    const res = await client.get(variables.ipfsHash)

    if (!res?.ok) throw new Error('Unexpected fetch response')

    const files = await res.files()

    // Load and parse the tree thru Web Worker
    const worker = new Worker(
      new URL('@/src/utils/merkle-tree/loadAndParseTree.ts', import.meta.url),
    )

    worker.postMessage({
      action: 'start',
      tree: await files[0].arrayBuffer(),
      userAddress: variables.userAddress,
    })

    const merkleTreeDataJson = await promisifyWorker(worker)

    return merkleTreeDataJson
  } catch (err) {
    console.error(err)
    return {}
  }
}

const useMerkleTreeData = (variables: Props) => {
  return useSWR([variables], fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
  })
}

export default useMerkleTreeData
