import type { NextApiRequest, NextApiResponse } from 'next'

import { getNftCollectionDataController } from '@/src/controllers/nft'

export enum Method {
  GET = 'GET',
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case Method.GET:
      await getNftCollectionDataController(req, res)
      break
    default:
      return res.status(400).json({ success: false })
  }
}

export default handler
