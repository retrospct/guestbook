import { Box, Icon, IconButton, Text } from '@chakra-ui/react'
import { TiCamera, TiCameraOutline } from 'react-icons/ti'

interface SelfieCameraSwitchProps {
  isFrontCamera: boolean
  toggleFrontCamera: () => void
}

export const SelfieCameraSwitch = (props: SelfieCameraSwitchProps) => {
  return (
    <Box position="fixed" top="100px" right={4} textAlign="center" maxW="60px" lineHeight={1}>
      <IconButton
        icon={props.isFrontCamera ? <Icon as={TiCamera} /> : <Icon as={TiCameraOutline} />}
        aria-label="Swap Front/Rear Camera"
        colorScheme="purple"
        onClick={props.toggleFrontCamera}
      />
      <Text fontSize="xs">Swap Camera</Text>
    </Box>
  )
}
