import { Box, Icon, IconButton, Text } from '@chakra-ui/react'
import { TiCamera, TiCameraOutline } from 'react-icons/ti'

interface SelfViewSwitchProps {
  selfView: boolean
  toggleSelfView: () => void
}

export const SelfViewSwitch = (props: SelfViewSwitchProps) => {
  return (
    <Box position="fixed" top={4} right="64px" textAlign="center" w="fit-content">
      <IconButton
        icon={props.selfView ? <Icon as={TiCamera} /> : <Icon as={TiCameraOutline} />}
        aria-label="Toggle Self View Camera"
        colorScheme={props.selfView ? 'green' : 'gray'}
        onClick={props.toggleSelfView}
      />
      <Text fontSize="xs">{props.selfView ? 'Stop Video' : 'Start Video'}</Text>
    </Box>
  )
}
