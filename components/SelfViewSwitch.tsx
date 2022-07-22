import { Box, Icon, IconButton, Text } from '@chakra-ui/react'
import { TiCamera, TiCameraOutline } from 'react-icons/ti'

interface SelfViewSwitchProps {
  selfView: boolean
  toggleSelfView: () => void
}

export const SelfViewSwitch = (props: SelfViewSwitchProps) => {
  return (
    <Box position="fixed" top={4} right={4} textAlign="center" w="60px" lineHeight={1.1}>
      <IconButton
        icon={props.selfView ? <Icon as={TiCamera} /> : <Icon as={TiCameraOutline} />}
        aria-label="Toggle Self View Camera"
        colorScheme={props.selfView ? 'purple' : 'gray'}
        onClick={props.toggleSelfView}
      />
      <Text fontSize="xs">{props.selfView ? 'Stop Video' : 'Start Video'}</Text>
    </Box>
  )
}
