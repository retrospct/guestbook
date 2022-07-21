import { useEffect, useRef, MutableRefObject, useState } from 'react'
import * as UpChunk from '@mux/upchunk'
import { Box, Heading, Spinner, Text } from '@chakra-ui/react'

import { mediaTypeSupported } from '../utils'
import styles from '../styles/SelfView.module.css'

const VIDEO_W = 2560
const VIDEO_H = 1440

interface SelfViewProps {
  selfView: boolean
}

export const SelfView = (props: SelfViewProps) => {
  const { selfView } = props
  const [duration, setDuration] = useState<number>(0)
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState<number>(3)
  const [isCounting, setIsCounting] = useState(false)
  // Init a ref for the videoElement and mediaRecorder
  const videoElement: MutableRefObject<HTMLVideoElement | null> = useRef(null)
  const mediaStream: MutableRefObject<MediaStream | null> = useRef(null)
  const mediaRecorder: MutableRefObject<MediaRecorder | null> = useRef(null)

  useEffect(() => {
    const initMediaStream = async () => {
      // Asks system for a MediaStream with audio + video
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: VIDEO_W },
          height: { min: VIDEO_H }
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
  }, [selfView])

  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
  }, [duration, isRecording])

  useEffect(() => {
    if (isCounting) {
      setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
  }, [isCounting, countdown])

  const startRecorder = () => {
    setDuration(0)
    setIsRecording(true)
    // save a new chunk of data every 500ms
    mediaRecorder.current?.start(500)
    // stop the video after x seconds
    setTimeout(() => {
      mediaRecorder.current?.stop()
      setIsRecording(false)
    }, 5000)
  }

  const onRecordButtonClick = () => {
    setCountdown(3)
    setIsCounting(true)
    // TODO: replace this with a hook with cancel to prevent issues
    // TODO: or disable record button while a recording is already active
    setTimeout(() => {
      startRecorder()
      setIsCounting(false)
    }, 3000)
  }

  return (
    <Box pos="relative" textAlign="center">
      {isCounting && (
        <Box pos="absolute" bottom="calc(50% - 24px)" left="calc(50% - 24px)" color="white" zIndex="1">
          <Heading color="white" fontSize="128px">
            {countdown}
          </Heading>
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
            style={{ width: '100%', maxWidth: VIDEO_W, height: '100%', maxHeight: VIDEO_H, transform: 'scaleX(-1)' }}
            ref={videoElement}
          />
          <button
            disabled={isRecording || isCounting}
            className={styles.btnRecord}
            style={{ top: 'calc(100% - 104px)' }}
            onClick={onRecordButtonClick}
          >
            <Heading size="md">{isRecording ? duration : 'REC'}</Heading>
          </button>
        </Box>
      )}
    </Box>
  )
}

// .btnRecord {
//   background: red;
//   border: 2px solid #fff;
//   border-radius: 100%;
//   color: #fff;
//   display: inline-block;
//   font-size: 14px;
//   font-weight: 400;
//   line-height: 1.42857;
//   margin-bottom: 0;
//   text-align: center;
//   vertical-align: middle;
//   white-space: nowrap;
//   cursor: pointer;
//   height: 80px;
//   width: 80px;
//   position: absolute;
//   /* top: VIDEO_H - (80 + 24); */
//   left: calc(50% - 40px);
// }

// .btnRecord:hover,
// .btnRecord:active,
// .btnRecord:focus {
//   background: deeppink;
//   color: #333;
//   border-color: #333;
// }
