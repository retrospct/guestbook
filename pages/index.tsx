import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { createClient } from '@supabase/supabase-js'
import { Heading } from '@chakra-ui/react'

import { config } from '../utils/config'
import { SelfView } from '../components/SelfView'
import { Gallery } from '../components/Gallery'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import { VideoAsset } from '../model'

const supabase = createClient(config.supabase.url, config.supabase.public_key)

interface HomeProps {
  assets?: VideoAsset[] | []
}

const Home: NextPage = (props: HomeProps) => {
  const [videos, setVideos] = useState<VideoAsset[]>([])

  // TODO: Move this up to _app or _document level in a context provider
  useEffect(() => {
    const subscription = supabase
      .from('activity')
      .on('INSERT', (event) => {
        console.log('event: ', event)
        if (event.new.type === 'video.asset.created') console.log('video.asset.created...')
        if (event.new.type === 'video.asset.ready') {
          console.log('ready...')
          setVideos((prev) => {
            if (!prev) return [event.new.payload]
            return [...prev, event.new.payload]
          })
        }
        if (event.new.type === 'video.asset.deleted') {
          console.log('deleted...')
          setVideos((prev) => {
            if (!prev) return []
            return prev.filter((video) => video.id !== event.new.payload.id)
          })
        }
      })
      .subscribe()
    console.log('subscription: ', subscription)

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const getVideos = async () => {
      try {
        const { assets } = await (await fetch('/api/videos')).json()
        console.log('assets: ', assets)
        setVideos(assets)
      } catch (err) {
        console.error(err)
      }
    }
    getVideos()
  }, [])

  return (
    <Container>
      <Head>
        <title>Leah&apos;s Guestbook</title>
        <meta name="description" content="A guestbook app made using React, TypeScript, Next.js, and Mux Video." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <SelfView />
        <Heading as="h1">Leah&apos;s Birthday Guestbook!</Heading>
        {videos?.length > 0 && <Gallery videos={videos} />}
      </Main>
      <DarkModeSwitch />
      <Footer />
    </Container>
  )
}

// export async function getServerSideProps() {
//   // TODO: set cache headers
//   // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

//   // TODO: init a single mux video client for the entire app
//   const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)
//   const assets = await Video.Assets.list({})
//   console.log('assets: ', assets)

//   // Just a experiment, this is an NextJs API antipattern API route + SSR call
//   // https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#getserversideprops-or-api-routes
//   // const { users } = await (await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/users`, { method: 'GET' })).json()
//   // console.log('users: ', users)

//   return {
//     props: { assets }
//   }
// }

export default Home
