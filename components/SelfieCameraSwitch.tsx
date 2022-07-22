import { Box, Icon, IconButton, Text } from '@chakra-ui/react'
import { CgSync } from 'react-icons/cg'

interface SelfieCameraSwitchProps {
  toggleFrontCamera: () => void
}

export const SelfieCameraSwitch = (props: SelfieCameraSwitchProps) => {
  return (
    <Box mb={3}>
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
