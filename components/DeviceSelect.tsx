import { useEffect, useState } from 'react'
import {
  Box,
  Icon,
  IconButton,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Select,
  Heading
} from '@chakra-ui/react'
import { CgChevronDown, CgChevronDownO } from 'react-icons/cg'
import { useMediaDevices, useLocalStorage } from 'react-use'

interface DeviceSelectProps {
  updateAudioInput: (deviceId: string) => void
  updateVideo: (deviceId: string) => void
}

export const DeviceSelect = (props: DeviceSelectProps) => {
  const mediaDevices: any = useMediaDevices()
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[] | null>(null)
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[] | null>(null)
  // const [selectedAudioInput, setSelectedAudioInput] = useState<string>()
  // const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>()
  const [selectedAudioInput, setSelectedAudioInput] = useLocalStorage<string>('audioInputDevice')
  const [selectedVideoDevice, setSelectedVideoDevice] = useLocalStorage<string>('videoDevice')

  useEffect(() => {
    if (mediaDevices) {
      setAudioInputDevices(mediaDevices.devices?.filter((device: any) => device.kind === 'audioinput'))
      setVideoDevices(mediaDevices.devices?.filter((device: any) => device.kind === 'videoinput'))
    }
  }, [mediaDevices])

  return (
    <Box>
      <Popover>
        <PopoverTrigger>
          <div>
            <IconButton icon={<Icon as={CgChevronDownO} />} aria-label="Device settings" colorScheme="gray" />
            <Text fontSize="xs">Devices</Text>
          </div>
        </PopoverTrigger>
        <PopoverContent textAlign="left">
          <PopoverArrow />
          <PopoverCloseButton p={7} />
          <PopoverHeader p={6}>Device Settings</PopoverHeader>
          <PopoverBody pt={5} pb={8} px={6}>
            <Box mb={4}>
              <Heading size="sm" pb={2}>
                Camera
              </Heading>
              <Select
                icon={<CgChevronDown />}
                value={selectedVideoDevice ? selectedVideoDevice : 'default'}
                placeholder="Select camera"
                onChange={(e) => {
                  setSelectedVideoDevice(e.target.value)
                  props.updateVideo(e.target.value)
                }}
              >
                {videoDevices?.map((device: MediaDeviceInfo) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Heading size="sm" pb={2}>
                Audio Input
              </Heading>
              <Select
                icon={<CgChevronDown />}
                value={selectedAudioInput ? selectedAudioInput : 'default'}
                placeholder="Select audio input"
                onChange={(e) => {
                  setSelectedAudioInput(e.target.value)
                  props.updateAudioInput(e.target.value)
                }}
              >
                {audioInputDevices?.map((device: MediaDeviceInfo) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </Select>
            </Box>
          </PopoverBody>
          <PopoverFooter py={5} px={6} maxW="100%">
            No devices? Refresh the page...
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
