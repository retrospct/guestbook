import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

import { config } from '../../utils/config'

const supabase = createClient(config.supabase.url, config.supabase.secret)

type Data = {
  status: string
}

// TODO: replace 'any' typing with the actual event response data payload
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { type, id, data } = req.body

  // FIXME: for some reason it's going into this ignore conditional even if type === 'video.asset.created'
  // if (type !== 'video.asset.created' || type !== 'video.asset.ready') {
  //   res.status(200).json({ status: 'ignored.' })
  //   return
  // }

  const insert = await supabase.from('activity').insert([{ type, event_id: id, payload: JSON.stringify(data) }])
  if (insert.error) {
    res.status(200).json({ error: insert.error })
    return
  }

  if (insert.data) {
    res.status(200).json({ data: insert.data })
    return
  }
  res.status(200).json({ status: 'ok' })
}

// video.asset.created example req.body payload
// {
//   "type": "video.asset.created",
//   "request_id": null,
//   "object": {
//     "type": "asset",
//     "id": "z3K6DX4yhJJ2CAe7ZcXCuWpNd501wa9axPmtROO5I5tc"
//   },
//   "id": "331b40f8-33f8-407f-a53e-e99283643a01",
//   "environment": {
//     "name": "Development",
//     "id": "dvlv0o"
//   },
//   "data": {
//     "upload_id": "gjjg48rGLX4hBM9NVLzfTs13r8nr02CkYWE02Byd8jgV00",
//     "test": true,
//     "status": "preparing",
//     "playback_ids": [
//       {
//         "policy": "public",
//         "id": "pZRRUL8HyLpvw8Cc01SZyKKgAzwT01lF02FUK5CFmw013HQ"
//       }
//     ],
//     "mp4_support": "none",
//     "master_access": "none",
//     "id": "z3K6DX4yhJJ2CAe7ZcXCuWpNd501wa9axPmtROO5I5tc",
//     "created_at": 1656362193
//   },
//   "created_at": "2022-06-27T20:36:34.000000Z",
//   "attempts": [],
//   "accessor_source": null,
//   "accessor": null
// }

// video.asset.ready example req.body payload
// {
//   "type": "video.asset.ready",
//   "request_id": null,
//   "object": {
//     "type": "asset",
//     "id": "z3K6DX4yhJJ2CAe7ZcXCuWpNd501wa9axPmtROO5I5tc"
//   },
//   "id": "4813455b-8fe8-40cc-9150-9aa5e2de67ca",
//   "environment": {
//     "name": "Development",
//     "id": "dvlv0o"
//   },
//   "data": {
//     "upload_id": "gjjg48rGLX4hBM9NVLzfTs13r8nr02CkYWE02Byd8jgV00",
//     "tracks": [
//       {
//         "type": "video",
//         "max_width": 1920,
//         "max_height": 1080,
//         "max_frame_rate": -1,
//         "id": "p3AUxxHVj600DwUD01p02XXMFI0118lGbNjDeJbYFe7Xyh00"
//       },
//       {
//         "type": "audio",
//         "max_channels": 1,
//         "max_channel_layout": "mono",
//         "id": "FAHPuZvRaWZ7hSX4jjvTM002bAUw2cM1JKEcL002ZOzPU"
//       }
//     ],
//     "test": true,
//     "status": "ready",
//     "playback_ids": [
//       {
//         "policy": "public",
//         "id": "pZRRUL8HyLpvw8Cc01SZyKKgAzwT01lF02FUK5CFmw013HQ"
//       }
//     ],
//     "non_standard_input_reasons": {
//       "video_frame_rate": "-1.00",
//       "audio_codec": "opus"
//     },
//     "mp4_support": "none",
//     "max_stored_resolution": "HD",
//     "max_stored_frame_rate": -1,
//     "master_access": "none",
//     "id": "z3K6DX4yhJJ2CAe7ZcXCuWpNd501wa9axPmtROO5I5tc",
//     "duration": 2.976,
//     "created_at": 1656362193,
//     "aspect_ratio": "16:9"
//   },
//   "created_at": "2022-06-27T20:36:38.000000Z",
//   "attempts": [],
//   "accessor_source": null,
//   "accessor": null
// }

// video.upload.asset_created example req.body payload
// {
//   "type": "video.upload.asset_created",
//   "request_id": null,
//   "object": {
//     "type": "upload",
//     "id": "gjjg48rGLX4hBM9NVLzfTs13r8nr02CkYWE02Byd8jgV00"
//   },
//   "id": "03a81509-049a-4c46-bc39-113e9b6638d4",
//   "environment": {
//     "name": "Development",
//     "id": "dvlv0o"
//   },
//   "data": {
//     "timeout": 3600,
//     "test": true,
//     "status": "asset_created",
//     "new_asset_settings": {
//       "playback_policies": [
//         "public"
//       ]
//     },
//     "id": "gjjg48rGLX4hBM9NVLzfTs13r8nr02CkYWE02Byd8jgV00",
//     "cors_origin": "guestbook-h0qn5cj5l-retrospct.vercel.app",
//     "asset_id": "z3K6DX4yhJJ2CAe7ZcXCuWpNd501wa9axPmtROO5I5tc"
//   },
//   "created_at": "2022-06-27T20:36:33.000000Z",
//   "attempts": [],
//   "accessor_source": null,
//   "accessor": null
// }
