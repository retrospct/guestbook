import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { createClient } from '@supabase/supabase-js'

import { config } from '../utils/config'
import { SelfView } from '../components/SelfView'
import { Gallery } from '../components/Gallery'

import styles from '../styles/Home.module.css'

const supabase = createClient(config.supabase.url, config.supabase.public_key)

const Home: NextPage = () => {
  // TODO: type this to a video asset type
  const [videos, setVideos] = useState<any[]>([])

  // TODO: Move this up to _app or _document level in a context provider
  useEffect(() => {
    const subscription = supabase
      .from('activity')
      .on('*', (event) => {
        /* Update our UI */
        console.log('event: ', event)
        if (event.new.payload.status === 'preparing') {
          // setVideos((prev) => [...prev, event.new])
          console.log('preparing...')
        }
        if (event.new.payload.status === 'ready') {
          console.log('ready...')
          setVideos((prev) => [...prev, event.new.payload])
          // setVideos((prev) => [...prev, prev.splice(prev.indexOf(event.new.id), 1, event.new)])
        }
      })
      .subscribe()
    console.log('subscription: ', subscription)

    return () => {}
  }, [])

  // TODO: Move this up to _app or _document level in a context provider or best practices for a nextjs app (getinitialprops?)
  useEffect(() => {
    const getVideos = async () => {
      try {
        const data = await (await fetch('/api/videos', { method: 'GET' })).json()
        console.log('videos getVideos: ', data)
        setVideos(data.assets)
      } catch (err) {
        console.error(err)
      }
    }
    getVideos()

    // TODO: move this to correct place and accessible via context or SWR or react-query
    const getUsers = async () => {
      try {
        const data = await (await fetch('/api/users', { method: 'GET' })).json()
        console.log('users getUsers: ', data)
      } catch (err) {
        console.error(err)
      }
    }
    getUsers()

    return () => {}
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Leah&apos;s Guestbook</title>
        <meta name="description" content="A guestbook app made using React, TypeScript, Next.js, and Mux Video." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Leah&apos;s Birthday Guestbook!</h1>
        <SelfView />
        <Gallery videos={videos} />
      </main>

      {/* <Footer /> */}
    </div>
  )
}

export default Home
