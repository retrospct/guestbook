import type { NextApiRequest, NextApiResponse } from 'next'
import Mux from '@mux/mux-node'

import { VideoAsset } from '../../model'

interface Data {
  assets: VideoAsset[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)

  const assets = await Video.Assets.list({ limit: 75 })

  res.status(200).json({ assets })
}
