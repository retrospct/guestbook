import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { SelfView } from '../components/SelfView'
import { createClient } from '@supabase/supabase-js'

import { config } from '../utils/config'

import styles from '../styles/Home.module.css'

const supabase = createClient(config.supabase.url, config.supabase.public_key)

const Home: NextPage = () => {
  const [items, setItems] = useState<any[]>([])

  // TODO: Move this up to _app or _document level in a context provider
  useEffect(() => {
    const subscription = supabase
      .from('activity')
      .on('*', (event) => {
        /* Update our UI */
        console.log('event: ', event)
        if (event.new.payload.status === 'preparing') {
          // setItems((prev) => [...prev, event.new])
          console.log('preparing...')
        }
        if (event.new.payload.status === 'ready') {
          console.log('ready...')
          setItems((prev) => [...prev, event.new.payload])
          // setItems((prev) => [...prev, prev.splice(prev.indexOf(event.new.id), 1, event.new)])
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
        setItems(data.assets)
      } catch (err) {
        console.error(err)
      }
    }
    getVideos()

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
        <div className={styles.grid}>
          {items?.length > 0 &&
            items.map((item) => (
              <a
                className={styles.gridItem}
                key={item.id}
                href={`https://stream.mux.com/${item.playback_ids[0].id}.m3u8`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`https://image.mux.com/${item.playback_ids[0].id}/animated.gif`}
                  width={320}
                  height={180}
                  alt="guestbook entry gif"
                />
              </a>
            ))}
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}

export default Home
