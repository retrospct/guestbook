import { useEffect, useState } from 'react'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import Mux from '@mux/mux-node'
import { createClient } from '@supabase/supabase-js'
import { Link as ChakraLink, Text, Heading, Code, List, ListIcon, ListItem } from '@chakra-ui/react'

import { config } from '../utils/config'
import { SelfView } from '../components/SelfView'
import { Gallery } from '../components/Gallery'
// import { Hero } from "../components/Hero";
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
// import { CTA } from "../components/CTA";
import { Footer } from '../components/Footer'
import { User, VideoAsset } from '../model'

// import styles from '../styles/Home.module.css'

const supabase = createClient(config.supabase.url, config.supabase.public_key)

interface HomeProps {
  assets: VideoAsset[]
  users: User[]
}

const Home: NextPage = ({ assets, users }: HomeProps) => {
  // TODO: type this to a video asset type
  const [videos, setVideos] = useState<VideoAsset[]>(assets)

  // TODO: Move this up to _app or _document level in a context provider
  useEffect(() => {
    const subscription = supabase
      .from('activity')
      .on('*', (event) => {
        /* Update our UI */
        console.log('event: ', event)
        if (event.new.payload.status === 'preparing') {
          console.log('preparing...')
        }
        if (event.new.payload.status === 'ready') {
          console.log('ready...')
          setVideos((prev) => [...prev, event.new.payload])
        }
      })
      .subscribe()
    console.log('subscription: ', subscription)

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    console.log('videos: ', videos)
    console.log('users: ', users)
  }, [videos, users])

  return (
    <Container height="100vh">
      <Head>
        <title>Leah&apos;s Guestbook</title>
        <meta name="description" content="A guestbook app made using React, TypeScript, Next.js, and Mux Video." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main height="full">
        <Heading as="h1">Leah&apos;s Birthday Guestbook!</Heading>
        <SelfView />
        <Gallery videos={videos} />
      </Main>
      <DarkModeSwitch />
      <Footer />
    </Container>
  )
}

export async function getServerSideProps({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  // TODO: init a single mux video client maybe? or fix typescript typings at least
  const { Video } = new Mux(process.env.MUX_TOKEN_ID ?? 'no-token', process.env.MUX_TOKEN_SECRET ?? 'no-secret')
  const assets = await Video.Assets.list({})

  // Just a experiment, this is an NextJs API antipattern
  // https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#getserversideprops-or-api-routes
  const users = await (await fetch(`${process.env.VERCEL_URL}/api/users`, { method: 'GET' })).json()
  console.log('users getUsers: ', users)

  return {
    props: { assets, users } // will be passed to the page component as props
  }
}

export default Home
