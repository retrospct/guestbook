import { useEffect, useRef, MutableRefObject, useState } from 'react'
import * as UpChunk from '@mux/upchunk'
import { Box, Heading } from '@chakra-ui/react'
import { useInterval, useLocalStorage } from 'react-use'
import { isMobile, isBrowser } from 'react-device-detect'

import { mediaTypeSupported } from '../utils'
import { SelfieCameraSwitch } from './SelfieCameraSwitch'
import { DeviceSelect } from './DeviceSelect'
import styles from '../styles/SelfView.module.css'

const VIDEO_W = 2560
const VIDEO_H = 1440

interface SelfViewProps {
  selfView: boolean
  // updateSelfView: (show: boolean) => void
}

export const SelfView = (props: SelfViewProps) => {
  const { selfView } = props
  const [duration, setDuration] = useState<number>(0)
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState<number>(3)
  const [isCounting, setIsCounting] = useState(false)
  const [isFrontCamera, setIsFrontCamera] = useState(true)
  const [audioInputDeviceLocal] = useLocalStorage('audioInputDevice')
  const [videoDeviceLocal] = useLocalStorage('videoDevice')
  const [audioInputDevice, setAudioInputDevice] = useState(audioInputDeviceLocal)
  const [videoDevice, setVideoDevice] = useState(videoDeviceLocal)
  // const [updateTracks, setUpdateTracks] = useState(false)
  // Init a ref for the videoElement and mediaRecorder
  const videoElement: MutableRefObject<HTMLVideoElement | null> = useRef(null)
  const mediaStream: MutableRefObject<MediaStream | null> = useRef(null)
  const mediaRecorder: MutableRefObject<MediaRecorder | null> = useRef(null)

  useEffect(() => {
    const initMediaStream = async () => {
      // Asks system for a MediaStream with audio + video
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: audioInputDevice as string } },
        video: {
          width: VIDEO_W,
          height: VIDEO_H,
          frameRate: { ideal: 30, max: 60 },
          facingMode: isFrontCamera ? 'user' : 'environment',
          deviceId: { exact: videoDevice as string }
        }
      })

      // Set video element to stream
      mediaStream.current = stream
      if (videoElement?.current) videoElement.current.srcObject = stream

      // Get MediaRecorder type support
      const mimeType = mediaTypeSupported()
      // console.log('mimeType:', mimeType)

      // MediaRecorder options
      const options = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 5000000,
        mimeType
      }

      // Init MediaRecorder and set it to the ref
      const recorder = new MediaRecorder(stream, options)
      mediaRecorder.current = recorder

      // Save data chunks to a var after the recorder is started
      let savedChunks: Blob[] = [] // TODO: make this a state value instead?
      mediaRecorder.current.ondataavailable = (event) => {
        const newChunkOfData = event.data
        savedChunks = [...savedChunks, newChunkOfData]
      }

      // Save & upload the data on recorder stop
      mediaRecorder.current.onstop = () => {
        // create a blob from savedChunks
        const finalBlob: Blob = new Blob(savedChunks, { type: options.mimeType })
        // ...and then a blob from that file...
        const createdFile = new File([finalBlob], `leah_hbd_clip_${Date.now()}`, {
          type: finalBlob.type
        })

        console.log('createdFile: ', createdFile)

        // TODO: implement save file locally
        // TODO: implement better UI feedback to user
        upload(createdFile)

        // cleanup saved chunks
        savedChunks = []
      }
    }

    const upload = async (file: File) => {
      try {
        const { id, url } = await (await fetch('/api/upload', { method: 'POST' })).json()

        const upload = UpChunk.createUpload({
          endpoint: url, // Authenticated url
          file, // File object with your video file’s properties
          chunkSize: 1024 * 4 // Uploads in 4 MB chunks
          // chunkSize: 30720 // Uploads the file in ~30 MB chunks
        })

        // Subscribe to events
        upload.on('error', (error) => {
          console.error(error.detail)
        })

        upload.on('progress', (event) => {
          console.log('event.detail: ', event.detail)
        })

        upload.on('success', () => {
          console.log("Wrap it up, we're done here. 👋")
          // setProgress(0)
        })
      } catch (error) {
        console.error(error)
      }
    }

    const stopStream = () => {
      mediaStream.current?.getTracks().forEach((track) => track.stop())
      // videoElement.current = null
      mediaStream.current = null
      mediaRecorder.current = null
    }

    selfView ? initMediaStream() : stopStream()

    return () => {
      if (mediaStream.current !== null || mediaRecorder.current !== null) stopStream()
    }
  }, [selfView, isFrontCamera, videoDevice, audioInputDevice])

  // useEffect(() => {
  //   if (isMobile) {
  //     document.addEventListener('visibilitychange', async () => {
  //       if (document.visibilityState === 'hidden') {
  //         updateSelfView(false)
  //       } else {
  //         updateSelfView(true)
  //       }
  //     })
  //   }
  // }, [updateSelfView])

  useInterval(
    () => {
      setDuration((prev) => prev + 1)
    },
    isRecording ? 1000 : null
  )

  useInterval(
    () => {
      setCountdown((prev) => prev - 1)
    },
    isCounting ? 1000 : null
  )

  const startRecorder = () => {
    setDuration(0)
    setIsRecording(true)
    // save a new chunk of data every 500ms
    mediaRecorder.current?.start(500)
    // stop the video after x seconds
    setTimeout(() => {
      mediaRecorder.current?.stop()
      setIsRecording(false)
    }, 5500)
  }

  const onRecordButtonClick = () => {
    setCountdown(3)
    setIsCounting(true)
    // TODO: replace this with a hook with cancel to prevent issues
    setTimeout(() => {
      startRecorder()
      setIsCounting(false)
    }, 3000)
  }

  return (
    <Box pos="relative" textAlign="center">
      {isCounting && (
        <Box w="100%" h="100%" pos="absolute" bottom={0} left={0} color="white" zIndex="1">
          <Box
            w="100%"
            h="100%"
            bg="blackAlpha.600"
            pos="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            // transition="all 0.25s ease-in-out"
          >
            <Heading color="white" fontSize="128px">
              {countdown}
            </Heading>
          </Box>
        </Box>
      )}
      {selfView && (
        <Box w="100%" pos="relative">
          <video
            autoPlay
            muted
            playsInline
            controls={false}
            width={VIDEO_W}
            height={VIDEO_H}
            style={{
              width: '100%',
              maxWidth: VIDEO_W,
              height: '100%',
              maxHeight: VIDEO_H
              // transform: isFrontCamera ? 'scaleX(-1)' : 'scaleX(1)'
            }}
            ref={videoElement}
          />
          <button
            disabled={isRecording || isCounting}
            style={{
              top: 'calc(100% - 130px)',
              background: isRecording ? 'deeppink' : 'var(--chakra-colors-purple-500)'
            }}
            className={styles.btnRecord}
            onClick={() => onRecordButtonClick()}
          >
            <Heading size="md">{isRecording ? duration : 'REC'}</Heading>
          </button>
          <Box
            pos="fixed"
            top="92px"
            right={4}
            display="flex"
            flexDirection="column"
            textAlign="center"
            w="60px"
            lineHeight={1.1}
          >
            {isMobile && <SelfieCameraSwitch toggleFrontCamera={() => setIsFrontCamera(!isFrontCamera)} />}
            {isBrowser && (
              <DeviceSelect
                updateAudioInput={(deviceId: string) => setAudioInputDevice(deviceId)}
                updateVideo={(deviceId: string) => setVideoDevice(deviceId)}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
