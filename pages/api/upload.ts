import type { NextApiRequest, NextApiResponse } from 'next'
import Mux from '@mux/mux-node'

type Data = {
  url: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { Video } = new Mux(process.env.MUX_TOKEN_ID ?? 'no-token', process.env.MUX_TOKEN_SECRET ?? 'no-secret')

  const upload = await Video.Uploads.create({
    cors_origin: 'https://your-app.com',
    new_asset_settings: {
      playback_policy: 'public'
    }
  })

  res.end(upload.url)
}
