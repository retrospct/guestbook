import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MuxPlayer from '@mux-elements/mux-player-react'

import styles from '../../styles/Video.module.css'
import React from 'react'

const Video: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div className={styles.container}>
      <Head>
        <title>Leah&apos;s Guestbook | Video {id}</title>
        <meta name="description" content="A guestbook app made using React, TypeScript, Next.js, and Mux Video." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <button type="button" onClick={() => router.push('/')}>
          &larr; Back
        </button>
      </header>
      <main className={styles.muxPlayer}>
        {!id || Array.isArray(id) ? <h2>Opps! No video ID was provided...</h2> : <VideoPlayer id={id} />}
      </main>
    </div>
  )
}

export default Video

const VideoPlayer = ({ id, ...rest }: { id: string }) => (
  <MuxPlayer
    {...rest}
    streamType="on-demand"
    playbackId={id}
    metadata={{
      video_id: id,
      video_title: id.slice(0, 7)
      // viewer_user_id: 'user-id-007' // id will be generated, add in actual users later
    }}
    autoPlay="any"
    loop
  />
)
