import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import pako from 'pako'

import { CSVParseType } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'

addEventListener(
  'message',
  (event: MessageEvent<{ action: string; whitelist: CSVParseType[] }>) => {
    if (event.data.action === 'start') {
      // Create tree
      const tree = StandardMerkleTree.of(event.data.whitelist, ['uint256', 'address', 'uint256'])

      // Compress json
      const compressedTree = pako.deflate(JSON.stringify(tree.dump()), { level: 9 })

      postMessage({
        compressedTree,
        root: tree.root,
      })
    }
  },
)
