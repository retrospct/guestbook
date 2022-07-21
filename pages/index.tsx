import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Heading } from '@chakra-ui/react'
import Mux from '@mux/mux-node'

import { supabase } from '../utils'
import { SelfView } from '../components/SelfView'
import { Gallery } from '../components/Gallery'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import { VideoAsset } from '../model'
import { SelfViewSwitch } from '../components/SelfViewSwitch'

interface HomeProps {
  assets?: VideoAsset[] | []
}

const Home: NextPage = (props: HomeProps) => {
  const [videos, setVideos] = useState<VideoAsset[]>(props.assets || [])
  const [selfView, setSelfView] = useState(false)

  useEffect(() => {
    console.log('subscription: ', supabase.getSubscriptions())
    if (supabase.getSubscriptions().length === 0 || supabase.getSubscriptions()[0]?.state === 'closed') {
      const subscription = supabase
        .from('activity')
        .on('INSERT', (event) => {
          console.log('event: ', event)
          if (event.new.type === 'video.asset.created') console.log('video.asset.created...')
          if (event.new.type === 'video.asset.ready') {
            console.log('ready...')
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
      })
      console.log('subscription in IF: ', supabase.getSubscriptions())
    }
    // FIXME: subscription is being closed as it initiates twice? Look into hoisting up this subscription to avoid rerendering.
    // return () => {
    //   supabase.removeAllSubscriptions()
    // }
  }, [])

  return (
    <Container>
      <Head>
        <title>Leah&apos;s Guestbook</title>
        <meta name="description" content="A guestbook app made using React, TypeScript, Next.js, and Mux Video." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <SelfView selfView={selfView} />
        {/* <Heading as="h1">Leah&apos;s Birthday Guestbook!</Heading> */}
        <Heading as="h1" pt="3rem">
          A Mux Video Guestbook!
        </Heading>
        {videos?.length > 0 && <Gallery videos={videos} />}
      </Main>
      <SelfViewSwitch selfView={selfView} toggleSelfView={() => setSelfView(!selfView)} />
      <DarkModeSwitch />
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
