import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import pako from 'pako'

import { AddressWhiteListProps } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'

addEventListener(
  'message',
  (event: MessageEvent<{ action: string; whitelist: AddressWhiteListProps[] }>) => {
    if (event.data.action === 'start') {
      // Format data: [index, address, amount]
      const formattedWhitelist = event.data.whitelist.map((obj) => [
        obj.index,
        obj.address,
        obj.amount,
      ])

      console.log('formattedWhitelist: ', formattedWhitelist)

      // Create tree
      const tree = StandardMerkleTree.of(formattedWhitelist, ['uint256', 'address', 'uint256'])

      // Compress json
      const compressedTree = pako.deflate(JSON.stringify(tree.dump()), { level: 9 })

      postMessage({
        compressedTree,
        root: tree.root,
      })
    }
  },
)
