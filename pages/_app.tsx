import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'

import { theme } from '../theme'

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session,
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <ChakraProvider theme={theme}>
      <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      {/* <Auth.UserContextProvider supabaseClient={supabase}> */}
      <Component {...pageProps} />
      {/* </Auth.UserContextProvider> */}
      </SessionContextProvider>
    </ChakraProvider>
  )
}

export default MyApp