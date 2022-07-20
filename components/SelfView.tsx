import { useEffect, useRef, MutableRefObject } from 'react'
import * as UpChunk from '@mux/upchunk'

import { mediaTypeSupported } from '../utils'

import styles from '../styles/SelfView.module.css'

const VIDEO_W = 2560
const VIDEO_H = 1440

interface SelfViewProps {
  selfView: boolean
}

export const SelfView = (props: SelfViewProps) => {
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

    const stopStream = () => {
      mediaStream.current?.getTracks().forEach((track) => track.stop())
      // videoElement.current = null
      mediaStream.current = null
      mediaRecorder.current = null
    }

    props.selfView ? initMediaStream() : stopStream()

    return () => {
      if (mediaStream.current !== null || mediaRecorder.current !== null) stopStream()
    }
  }, [props.selfView])

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

      upload.on('progress', (progress) => {
        console.log(progress.detail)
      })

      upload.on('success', () => {
        console.log("Wrap it up, we're done here. 👋")
      })
    } catch (error) {
      console.error(error)
    }
  }

  const startRecorder = () => {
    // save a new chunk of data every 500ms
    mediaRecorder.current?.start(500)
    // stop the video after three seconds
    setTimeout(() => {
      mediaRecorder.current?.stop()
    }, 3000)
  }

  const onRecordButtonClick = () => {
    // TODO: replace this with a hook with cancel to prevent issues
    // TODO: or disable record button while a recording is already active
    setTimeout(() => {
      startRecorder()
    }, 1000)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {props.selfView && (
        <div style={{ width: '100%', position: 'relative', background: '#000' }}>
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
          <button className={styles.btnRecord} style={{ top: 'calc(100% - 104px)' }} onClick={onRecordButtonClick}>
            REC
          </button>
        </div>
      )}
      {/* <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <button className={styles.btnSolid} onClick={() => setSelfView(!selfView)}>
          Camera On/Off
        </button>
      </div> */}
    </div>
  )
}
