import { Flex, FlexProps } from '@chakra-ui/react'

export const Container = (props: FlexProps) => (
  <Flex
    minH="100vh"
    maxH="100%"
    direction="column"
    alignItems="center"
    justifyContent="flex-start"
    bg="gray.50"
    color="black"
    _dark={{
      bg: 'gray.900',
      color: 'white'
    }}
    transition="all 0.15s ease-out"
    {...props}
  />
)
