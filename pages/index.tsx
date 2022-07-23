import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Heading, Text } from '@chakra-ui/react'
import Mux from '@mux/mux-node'
import { isMobile } from 'react-device-detect'

import { supabase } from '../utils'
import { SelfView } from '../components/SelfView'
import { Gallery } from '../components/Gallery'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
// import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import { VideoAsset } from '../model'
import { SelfViewSwitch } from '../components/SelfViewSwitch'

interface HomeProps {
  assets?: VideoAsset[] | []
}

const Home: NextPage = (props: HomeProps) => {
  const [videos, setVideos] = useState<VideoAsset[]>(props.assets || [])
  const [selfView, setSelfView] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    console.log('subscription: ', supabase.getSubscriptions())
    if (supabase.getSubscriptions().length === 0 || supabase.getSubscriptions()[0]?.state === 'closed') {
      const subscription = supabase
        .from('activity')
        .on('*', (event) => {
          console.log('event: ', event)
          if (event.new.type === 'video.asset.created') {
            console.log('video.asset.created...')
            setIsProcessing(true)
          }
          if (event.new.type === 'video.asset.ready') {
            console.log('ready...')
            setIsProcessing(false)
            setVideos((prev) => {
              if (!prev || prev.length === 0) return [event.new.payload]
              return [event.new.payload, ...prev]
            })
          }
          if (event.new.type === 'video.asset.deleted') {
            console.log('deleted...')
            setVideos((prev) => {
              if (prev.length === 1) return []
              return prev.filter((video) => video.id !== event.new.payload.id)
            })
          }
        })
        .subscribe()

      subscription.onClose(() => {
        console.log('subscription closed...')
        subscription.rejoinUntilConnected()
        console.log('subscription in closed: ', supabase.getSubscriptions())
      })

      console.log('subscription in IF: ', supabase.getSubscriptions())
    }

    // FIXME: subscription is being closed as it initiates twice? Look into hoisting up this subscription to avoid rerendering.
    // return () => {
    //   supabase.removeAllSubscriptions()
    // }
  }, [])

  useEffect(() => {
    if (isMobile) {
      const updateVideos = async () => {
        console.log('updating videos...')
        const data = await (await fetch('/api/videos', { headers: { 'Content-Type': 'application/json' } })).json()
        setVideos(data.assets)
      }

      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'hidden') {
          console.log('browser hidden visibility')
        } else {
          console.log('browser back in view')
          // if (!subscription.isJoining()) subscription.rejoinUntilConnected()
          // await updateVideos()
          await updateVideos()
        }
        console.log('subscription in visibility: ', supabase.getSubscriptions())
      })
    }
  }, [])

  return (
    <Container>
      <Head>
        <title>🐙 Leah&apos;s Guestbook</title>
        <meta name="description" content="A guestbook app made using React, TypeScript, Next.js, and Mux Video." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <SelfView selfView={selfView} updateSelfView={(show: boolean) => setSelfView(show)} />
        <Heading as="h1" pt={14} textAlign="center">
          🐙 Leah&apos;s Birthday Guestbook!
        </Heading>
        <Text>
          Record a quick clip or more to say hello! We&apos;ll have a photobooth setup during the party as well.
        </Text>
        {videos?.length > 0 && <Gallery videos={videos} processing={isProcessing} />}
      </Main>
      <SelfViewSwitch selfView={selfView} toggleSelfView={() => setSelfView(!selfView)} />
      {/* <DarkModeSwitch /> */}
      <Footer />
    </Container>
  )
}

export async function getServerSideProps() {
  // https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#caching-with-server-side-rendering-ssr
  // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30')

  // TODO: init a single mux video client for the entire app
  const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)
  const assets = await Video.Assets.list({})
  console.log('assets: ', assets?.length)

  return { props: { assets } }
}

export default Home
