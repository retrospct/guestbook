import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MuxPlayer from '@mux-elements/mux-player-react'

import { Container } from '../../components/Container'
import { Main } from '../../components/Main'
import { DarkModeSwitch } from '../../components/DarkModeSwitch'
import { Footer } from '../../components/Footer'

import styles from '../../styles/Video.module.css'

const Video: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Container height="100vh">
      <Head>
        <title>Leah&apos;s Guestbook | Video {id}</title>
        <meta name="description" content="A guestbook app made using React, TypeScript, Next.js, and Mux Video." />
        <link rel="icon" href="/favicon.ico" />
        <script defer src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1" />
      </Head>

      <Main height="full">
        <div className={styles.playerHeader}>
          <button type="button" onClick={() => router.push('/')}>
            &larr; Back
          </button>
        </div>
        <main className={styles.muxPlayer}>
          {!id || Array.isArray(id) ? <h2>Opps! No video ID was provided...</h2> : <VideoPlayer id={id} />}
        </main>
      </Main>
      <DarkModeSwitch />
      <Footer />
    </Container>
  )
}

export default Video

const VideoPlayer = ({ id, ...rest }: { id: string }) => (
  <MuxPlayer
    {...rest}
    style={{ height: '100%', maxWidth: '100%' }}
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
