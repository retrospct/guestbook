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

  useEffect(() => {
    const subscription = supabase
      .from('activity')
      .on('*', (payload) => {
        /* Update our UI */
        console.log('payload: ', payload)
        if (payload.new.payload.status === 'preparing') {
          // setItems((prev) => [...prev, payload.new])
          console.log('preparing...')
        }
        if (payload.new.payload.status === 'ready') {
          console.log('ready...')
          setItems((prev) => [...prev, payload.new])
          // setItems((prev) => [...prev, prev.splice(prev.indexOf(payload.new.id), 1, payload.new)])
        }
      })
      .subscribe()
    console.log('subscription: ', subscription)

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
                key={item.payload.id}
                href={`https://stream.mux.com/${item.payload.playback_ids[0].id}.m3u8`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`https://image.mux.com/${item.payload.playback_ids[0].id}/animated.gif`}
                  width={320}
                  height={180}
                  alt="guestbook entry gif"
                  // className={styles.gridItem}
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
