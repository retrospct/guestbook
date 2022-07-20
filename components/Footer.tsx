import { Link as ChakraLink, Flex, FlexProps, Icon, Text } from '@chakra-ui/react'
import { GoHeart, GoMarkGithub } from 'react-icons/go'

export const Footer = (props: FlexProps) => (
  <Flex as="footer" py="8rem" {...props}>
    <Text>
      <Icon as={GoHeart} color="red.400" />{' '}
      <ChakraLink href="https://github.com/retrospct/guestbook" isExternal>
        @retrospct <Icon as={GoMarkGithub} mx="2px" />
      </ChakraLink>
    </Text>
  </Flex>
)
