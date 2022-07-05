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
  // TODO: init a single mux video client maybe? or fix typescript typings at least
  const { Video } = new Mux(process.env.MUX_TOKEN_ID ?? 'no-token', process.env.MUX_TOKEN_SECRET ?? 'no-secret')

  const assets = await Video.Assets.list({})

  res.end(JSON.stringify(assets))
}
