import type { NextApiRequest, NextApiResponse } from 'next'
import Mux from '@mux/mux-node'

interface Data {
  token: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { playback_id } = req.body
  const token = Mux.JWT.sign(playback_id)
  // Most simple request, defaults to type video and is valid for 7 days.
  // const token = Mux.JWT.sign('some-playback-id');
  // // https://stream.mux.com/some-playback-id.m3u8?token=${token}

  // // If you wanted to sign a thumbnail
  // const thumbParams = { time: 14, width: 100 };
  // const thumbToken = Mux.JWT.sign('some-playback-id', {
  //   type: 'thumbnail',
  //   params: thumbParams,
  // });
  // // https://image.mux.com/some-playback-id/thumbnail.jpg?token=${token}

  // // If you wanted to sign a gif
  // const gifToken = Mux.JWT.sign('some-playback-id', { type: 'gif' });
  // // https://image.mux.com/some-playback-id/animated.gif?token=${token}

  // // And, an example for a storyboard
  // const storyboardToken = Mux.JWT.sign('some-playback-id', {
  //   type: 'storyboard',
  // });
  // https://image.mux.com/some-playback-id/storyboard.jpg?token=${token}
  res.status(200).json({ token })
}
