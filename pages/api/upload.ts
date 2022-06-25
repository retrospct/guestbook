import type { NextApiRequest, NextApiResponse } from 'next'
import Mux from '@mux/mux-node'

type Data = {
  url: string
}

const cors_origin = process.env.VERCEL_URL ?? 'http://localhost:3000'
console.log('cors_origin: ', cors_origin)

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // TODO: fix typescript typing here for token and secret
  const { Video } = new Mux(process.env.MUX_TOKEN_ID ?? 'no-token', process.env.MUX_TOKEN_SECRET ?? 'no-secret')

  const upload = await Video.Uploads.create({
    cors_origin,
    new_asset_settings: {
      playback_policy: 'public'
    }
  })

  res.end(upload.url)
}
