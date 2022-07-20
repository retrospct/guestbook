import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

import { theme } from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      {/* <Auth.UserContextProvider supabaseClient={supabase}> */}
      <Component {...pageProps} />
      {/* </Auth.UserContextProvider> */}
    </ChakraProvider>
  )
}

export default MyApp
