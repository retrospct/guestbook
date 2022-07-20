import type { NextApiRequest, NextApiResponse } from 'next'
import Mux from '@mux/mux-node'

interface Data {
  message: string
  success: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const { id } = req.body
    const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)
    await Video.Assets.del(id)
    return res.status(200).json({ message: 'Asset deleted successfully', success: true })
  } catch (err) {
    console.error('Delete request error', err)
    return res.status(500).json({ message: 'Error deleting asset', success: false })
  }
}
