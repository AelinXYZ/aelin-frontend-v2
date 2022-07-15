import { useCallback, useState } from 'react'

import { Interface, LogDescription } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, Log } from '@ethersproject/providers'

import CryptoPunksABI from '@/src/abis/CryptoPunks.json'
import ERC1155ABI from '@/src/abis/ERC1155.json'
import ERC721ABI from '@/src/abis/ERC721.json'
import { getNetworkConfig } from '@/src/constants/chains'
import { ZERO_ADDRESS } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export type WhitelistRule = {
  allocationAmount: number
  minimumAmounts: Record<number, number> | null
}

type WhitelistedUserNft = {
  id: number
  imageUrl: string
}

const CRYPTO_PUNKS_ADDRESS = '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB'

const getAbi = (collectionAddress: string, minimumAmounts: Record<number, number> | null) => {
  if (collectionAddress.toLowerCase() === CRYPTO_PUNKS_ADDRESS.toLowerCase()) {
    return CryptoPunksABI
  }

  if (minimumAmounts === null) {
    return ERC721ABI
  }

  return ERC1155ABI
}

// TODO [AELIP-15]: Add logic for ERC-1155 and CryptoPunks.
export default function useWhitelistedUserNfts(whitelistRules: Record<string, WhitelistRule>) {
  const [data, setData] = useState<Record<string, WhitelistedUserNft[]>>({})
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { address: userAddress, appChainId } = useWeb3Connection()

  const fetchWhitelistedUserNfts = useCallback(async () => {
    try {
      setData({})
      setIsError(false)
      setIsLoading(true)

      const collectionsNftsRequests = []

      const fetchCollectionNfts = async (collectionAddress: string) => {
        const abi = getAbi(collectionAddress, whitelistRules[collectionAddress].minimumAmounts)
        const provider = new JsonRpcProvider(getNetworkConfig(appChainId).rpcUrl)
        const contract = new Contract(collectionAddress, abi, provider)
        const abiInterface = new Interface(abi)

        const logs: Log[] = []
        const logsRequests = []

        const fetchLogsBatch = async (fromBlock: number, toBlock: number) => {
          const filter = {
            address: collectionAddress,
            fromBlock: fromBlock,
            toBlock: toBlock,
          }
          const newLogs = await provider.getLogs(filter)
          logs.push(...newLogs)
        }

        const batchSize = 2000
        // TODO [AELIP-15]: It is only for testing on Goerli.
        // We need to find a way to not start from 0, because we have a lot of blocks on mainnet also but cannot request more than 2000.
        const firstBlock = 7053300
        const latestBlock = await provider.getBlockNumber()
        let toBlock = latestBlock
        while (toBlock >= firstBlock) {
          logsRequests.push(fetchLogsBatch(Math.max(toBlock - batchSize + 1, firstBlock), toBlock))
          toBlock -= batchSize
        }

        await Promise.all(logsRequests)

        const initialValue: WhitelistedUserNft[] = []
        const nfts = await logs.reduce(async (previous, current) => {
          const items: WhitelistedUserNft[] = await previous
          let parsedLog: LogDescription

          try {
            parsedLog = abiInterface.parseLog(current)
          } catch (_) {
            return items
          }

          if (parsedLog.name !== 'Transfer' || parsedLog.args.from !== ZERO_ADDRESS) {
            return items
          }

          const to = parsedLog.args.to.toLowerCase()
          const tokenId = parsedLog.args.tokenId.toNumber()

          if (
            to === userAddress?.toLowerCase() &&
            (whitelistRules[collectionAddress].minimumAmounts == null
              ? true
              : Object.prototype.hasOwnProperty.call(
                  whitelistRules[collectionAddress].minimumAmounts,
                  tokenId,
                ))
          ) {
            const tokenURI = await contract.tokenURI(tokenId)
            const nftMetadataResponse = await fetch(tokenURI)
            const nftMetadata = await nftMetadataResponse.json()

            const item = {
              id: tokenId,
              imageUrl: nftMetadata.image,
            }

            items.push(item)
          }

          return items
        }, Promise.resolve(initialValue))

        setData((prevData) => {
          const newData = { ...prevData }
          newData[collectionAddress] = nfts
          return newData
        })
      }

      for (const collectionAddress in whitelistRules) {
        collectionsNftsRequests.push(fetchCollectionNfts(collectionAddress))
      }

      await Promise.all(collectionsNftsRequests)
    } catch (err: any) {
      setIsError(!!err?.message)
    }

    setIsLoading(false)
  }, [userAddress, appChainId, whitelistRules])

  return { data, isLoading, isError, fetchWhitelistedUserNfts }
}
