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
  // PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Select,
  Heading
} from '@chakra-ui/react'
import { CgPolaroid, CgChevronDown, CgChevronDownO } from 'react-icons/cg'
import { useMediaDevices } from 'react-use'

interface DeviceSelectProps {
  devices?: MediaDeviceInfo[]
  mediaStream?: any
}

export const DeviceSelect = (props: DeviceSelectProps) => {
  const mediaDevices: any = useMediaDevices()
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[] | null>(null)
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[] | null>(null)
  const [selectedAudioInput, setSelectedAudioInput] = useState<string>()
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>()

  useEffect(() => {
    if (mediaDevices) {
      setAudioInputDevices(mediaDevices.devices?.filter((device: any) => device.kind === 'audioinput'))
      setVideoDevices(mediaDevices.devices?.filter((device: any) => device.kind === 'videoinput'))
    }
  }, [mediaDevices])

  useEffect(() => {
    if (selectedVideoDevice) {
      console.log('selectedVideoDevice', selectedVideoDevice)
      props.mediaStream?.current?.setSinkId(selectedVideoDevice) // FIXME: this does not work
    }
  }, [selectedVideoDevice, props.mediaStream])

  return (
    <Box position="fixed" top="90px" right={6} maxW="60px" textAlign="left" lineHeight={1.1}>
      <Popover>
        <PopoverTrigger>
          <div>
            <IconButton icon={<Icon as={CgChevronDownO} />} aria-label="Device settings" colorScheme="gray" />
            <Text fontSize="xs">Devices</Text>
          </div>
        </PopoverTrigger>
        <PopoverContent>
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
                value={selectedVideoDevice}
                placeholder="Select camera"
                onChange={(e) => setSelectedVideoDevice(e.target.value)}
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
                value={selectedAudioInput}
                placeholder="Select audio input"
                onChange={(e) => setSelectedAudioInput(e.target.value)}
              >
                {audioInputDevices?.map((device: MediaDeviceInfo) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </Select>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
