import type { NextApiRequest, NextApiResponse } from 'next'
import Mux from '@mux/mux-node'

import { VideoAsset } from '../../model'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}

interface Data {
  assets: VideoAsset[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // TODO: init a single mux video client maybe? or fix typescript typings at least
  const { Video } = new Mux(process.env.MUX_TOKEN_ID ?? 'no-token', process.env.MUX_TOKEN_SECRET ?? 'no-secret')

  const assets = await Video.Assets.list({})

  res.status(200).json({ assets })
}
