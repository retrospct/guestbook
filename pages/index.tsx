import { useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { SelfView } from '../components/SelfView'
import { createClient } from '@supabase/supabase-js'

import { config } from '../utils/config'

import styles from '../styles/Home.module.css'

const supabase = createClient(config.supabase.url, config.supabase.public_key)

const Home: NextPage = () => {
  useEffect(() => {
    const subscription = supabase
      .from('activity')
      .on('*', (payload) => {
        /* Update our UI */
        console.log('payload: ', payload)
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
