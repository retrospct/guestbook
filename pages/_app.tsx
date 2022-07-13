import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

import theme from '../theme'
// import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <div style={{ height: '100%' }}>
        <Component {...pageProps} />
      </div>
    </ChakraProvider>
  )
}

export default MyApp
