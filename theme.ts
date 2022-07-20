import { extendTheme, type ThemeConfig, ThemeOverride } from '@chakra-ui/react'
import { createBreakpoints, mode } from '@chakra-ui/theme-tools'

export const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em'
})

const styles = {}

const base: ThemeOverride = {
  config,
  styles: {
    global: (props) => ({
      body: {
        fontFamily: 'body',
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('white', 'gray.800')(props),
        lineHeight: 'base'
      },
      '*::placeholder': {
        color: mode('gray.400', 'whiteAlpha.400')(props)
      },
      '*, *::before, &::after': {
        borderColor: mode('gray.200', 'whiteAlpha.300')(props),
        wordWrap: 'break-word'
      }
    })
  },
  semanticTokens: {
    colors: {
      text: {
        default: '#16161D',
        _dark: '#ade3b8'
      },
      heroGradientStart: {
        default: '#7928CA',
        _dark: '#e3a7f9'
      },
      heroGradientEnd: {
        default: '#FF0080',
        _dark: '#fbec8f'
      }
    },
    radii: {
      button: '12px'
    }
  },
  colors: {
    black: '#16161D'
  },
  fonts,
  breakpoints
}

export const theme = extendTheme(base)
