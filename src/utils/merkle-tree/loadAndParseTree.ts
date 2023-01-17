import { getAddress } from '@ethersproject/address'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import pako from 'pako'

type Values = {
  value: [number, string, string] // index, address, amount
  treeIndex: number
}

addEventListener(
  'message',
  (event: MessageEvent<{ action: string; tree: pako.Data; userAddress: string }>) => {
    if (event.data.action === 'start') {
      if (!event.data.userAddress) {
        return postMessage({})
      }

      const treeInJSON = JSON.parse(pako.inflate(event.data.tree, { to: 'string' }))

      const tree = StandardMerkleTree.load(treeInJSON)

      const index = treeInJSON.values.findIndex(
        (val: Values) => getAddress(val.value[1]) === getAddress(event.data.userAddress),
      )

      if (index === -1) {
        return postMessage({})
      }

      const amount = treeInJSON.values[index].value[2]

      const proof = tree.getProof(index)

      console.log('result ', {
        index,
        proof,
        amount,
      })

      postMessage({
        index,
        proof,
        amount,
      })
    }
  },
)
