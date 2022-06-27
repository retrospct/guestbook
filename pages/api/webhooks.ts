import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

import { config } from '../../utils/config'

const supabase = createClient(config.supabase.url, config.supabase.secret)

type Data = {
  status: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { type, data, metadata } = req.body

  res.status(200).json(req.body)
  return

  if (type !== 'video.asset.created' || type !== 'video.asset.ready') {
    res.status(200).json({ status: 'ignored.' })
    return
  }

  console.log('data: ', data)
  console.log('metadata: ', metadata)

  await supabase.from('activity').insert([{ entry_id: metadata.entry_id, payload: JSON.stringify(data) }])
  res.status(200).json({ status: 'ok' })
}
