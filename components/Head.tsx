import NextHead from 'next/head'
import { useColorMode } from '@chakra-ui/react'

interface HeadProps {
  title?: string
  description?: string
  children?: React.ReactNode
}

export function Head(props: HeadProps) {
  const { colorMode } = useColorMode()
  return (
    <NextHead>
      <title>{props.title || 'Leah&apos;s Guestbook'}</title>
      <meta
        name="description"
        content={props.description || 'A guestbook app made using React, TypeScript, Next.js, and Mux Video.'}
      />
      <link rel="icon" href={colorMode === 'dark' ? '/favicon-dark.ico' : '/favicon.ico'} />
      {props.children}
    </NextHead>
  )
}
