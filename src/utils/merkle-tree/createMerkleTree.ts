import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import pako from 'pako'

import { getWhiteListAmount } from '../getWhiteListAmount'
import {
  AddressWhiteListProps,
  AddressesWhiteListAmountFormat,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'

addEventListener(
  'message',
  (
    event: MessageEvent<{
      action: string
      whitelist: AddressWhiteListProps[]
      investmentTokenDecimal: number
      whiteListAmountFormat: AddressesWhiteListAmountFormat
    }>,
  ) => {
    if (event.data.action === 'start') {
      // Format data: [index, address, amount]
      const formattedWhitelist = event.data.whitelist.map((obj) => {
        return [
          obj.index,
          obj.address,
          getWhiteListAmount(
            obj.amount as string,
            event.data.whiteListAmountFormat,
            event.data.investmentTokenDecimal,
          ),
        ]
      })

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
