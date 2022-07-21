import { Box, Icon, IconButton, Text } from '@chakra-ui/react'
import { CgSync } from 'react-icons/cg'

interface SelfieCameraSwitchProps {
  isFrontCamera: boolean
  toggleFrontCamera: () => void
}

export const SelfieCameraSwitch = (props: SelfieCameraSwitchProps) => {
  return (
    <Box position="fixed" top="90px" right={4} textAlign="center" maxW="60px" lineHeight={1.1}>
      <IconButton
        icon={<Icon as={CgSync} />}
        aria-label="Swap Front/Rear Camera"
        colorScheme="gray"
        onClick={props.toggleFrontCamera}
      />
      <Text fontSize="xs">Swap Camera</Text>
    </Box>
  )
}
