import { Link as ChakraLink, Flex, FlexProps, Text } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export const Footer = (props: FlexProps) => (
  <Flex as="footer" py="8rem" {...props}>
    <Text>
      ❤️{' '}
      <ChakraLink href="https://github.com/retrospct/guestbook" isExternal>
        @retrospct <ExternalLinkIcon mx="2px" />
      </ChakraLink>
    </Text>
  </Flex>
)
