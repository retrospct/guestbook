import type { NextApiRequest, NextApiResponse } from 'next'
import Mux from '@mux/mux-node'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}

type Data = {
  id: string
  url: string
}

const cors_origin = process.env.VERCEL_URL ?? 'http://localhost:3000'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // TODO: fix typescript typing here for token and secret
  const { Video } = new Mux(process.env.MUX_TOKEN_ID ?? 'no-token', process.env.MUX_TOKEN_SECRET ?? 'no-secret')

  const upload = await Video.Uploads.create({
    cors_origin,
    new_asset_settings: {
      playback_policy: 'public'
    }
  })

  res.end(JSON.stringify({ id: upload.id, url: upload.url }))
}
