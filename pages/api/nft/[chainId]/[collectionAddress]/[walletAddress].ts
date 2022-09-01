import type { NextApiRequest, NextApiResponse } from 'next'

import cors from 'cors'
import { createRouter, expressWrapper } from 'next-connect'

import { getNftOwnedByAddressController } from '@/src/controllers/nft'

const router = createRouter<NextApiRequest, NextApiResponse>()

router.use(expressWrapper(cors()))

router.get((req: NextApiRequest, res: NextApiResponse) => {
  return getNftOwnedByAddressController(req, res)
})

export default router.handler({
  onError(err, req: NextApiRequest, res: NextApiResponse) {
    res.status(500).json({
      error: (err as Error).message,
    })
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end('Page is not found')
  },
})
