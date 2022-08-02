import type { NextApiRequest, NextApiResponse } from 'next'

import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { getNftCollectionData, getNftOwnedByAddress } from '@/src/services/nft'
import { CustomError } from '@/src/utils/error'

export const getNftOwnedByAddressController = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { chainId, collectionAddress, walletAddress } = req.query

    if (
      !chainId ||
      typeof chainId !== 'string' ||
      !getKeyChainByValue(Number(chainId) as ChainsValues)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Network.',
      })
    }

    if (!collectionAddress || typeof collectionAddress !== 'string') {
      return res.status(404).json({ success: false, message: 'Invalid collection address' })
    }

    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(404).json({ success: false, message: 'Invalid walletAddress address' })
    }

    const data = await getNftOwnedByAddress(
      Number(chainId) as ChainsValues,
      collectionAddress,
      walletAddress,
    )

    return res.status(200).json({ success: true, data })
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ success: false, message: error.message })
    }

    return res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}

export const getNftCollectionDataController = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { chainId, collectionAddress } = req.query

    if (
      !chainId ||
      typeof chainId !== 'string' ||
      !getKeyChainByValue(Number(chainId) as ChainsValues)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Network.',
      })
    }

    if (!collectionAddress || typeof collectionAddress !== 'string') {
      return res.status(404).json({ success: false, message: 'Invalid collection address' })
    }

    const data = await getNftCollectionData(Number(chainId) as ChainsValues, collectionAddress)

    return res.status(200).json({ success: true, data })
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ success: false, message: error.message })
    }

    return res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
