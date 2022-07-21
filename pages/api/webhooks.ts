import type { NextApiRequest, NextApiResponse } from 'next'

import { supabase } from '../../utils'

type Data = {
  status: string
  type?: string
  event_id?: string
  payload?: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Verify webhook signature
  // const muxSig = req.headers['mux-signature'] as string
  // console.log('muxSig:', muxSig)
  // const isValidSignature = Mux.Webhooks.verifyHeader(
  //   JSON.stringify(req.body, null, 2),
  //   muxSig,
  //   process.env.MUX_WEBHOOK_SECRET!
  // )
  // console.log('isValidSignature:', isValidSignature)

  const { type, id, data } = req.body

  // Filter for only events we care about
  if (
    type !== 'video.asset.created' &&
    type !== 'video.asset.ready' &&
    type !== 'video.asset.deleted' &&
    type !== 'video.asset.errored' &&
    type !== 'video.asset.updated'
  ) {
    console.log('type: ', type)
    res.status(200).json({ status: 'ignored' })
    return
  }

  // Insert a new record into the "activity" table
  const newActivity = { type, event_id: id, payload: JSON.stringify(data) }
  const { error } = await supabase.from('activity').insert([newActivity])

  if (error) {
    res.status(500).json({ status: 'error', ...newActivity })
    return
  }

  res.status(200).json({ status: 'ok', ...newActivity })
}
