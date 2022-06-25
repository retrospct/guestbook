import { useEffect, useRef, useState, MutableRefObject } from 'react'
import { bytesToSize } from '../utils'

const VIDEO_H = 720
const VIDEO_W = 1280

interface LastFile {
  name: string
  lastModified: number
  size: number
}

export const SelfView = () => {
  // Init a ref for the videoElement and mediaRecorder
  const videoElement: MutableRefObject<HTMLVideoElement | null> = useRef(null)
  const mediaStream: MutableRefObject<MediaStream | null> = useRef(null)
  const mediaRecorder: MutableRefObject<MediaRecorder | null> = useRef(null)

  const [lastFile, setLastFile] = useState<LastFile | null>(null)
  const [gallery, setGallery] = useState<LastFile[] | null>(null)
  const [selfView, setSelfView] = useState(false)

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

      // MediaRecorder options
      const options = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 5000000,
        mimeType: `video/webm;codecs=vp9`
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
        let finalBlob: Blob = new Blob(savedChunks, { type: options.mimeType })
        // ...and then a blob from that file...
        // TODO: is there a better way to generate a clip number, otherwise make this a util function
        const createdFile = new File([finalBlob], `leah_hbd_clip_${Date.now()}`, {
          type: finalBlob.type
        })

        console.log('createdFile: ', createdFile)

        // TODO: implement save file locally

        // TODO: implement upload to mux
        // upload(createdFile);

        // TODO: implement better UI feedback to user
        setLastFile({ name: createdFile.name, lastModified: createdFile.lastModified, size: createdFile.size })

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

    selfView ? initMediaStream() : stopStream()

    return () => {}
  }, [selfView])

  useEffect(() => {
    if (lastFile && !gallery) setGallery([lastFile])
    else if (lastFile && gallery) setGallery([...gallery, lastFile])
    return () => {}
  }, [lastFile])

  // const toggleStream = (stream: MutableRefObject<MediaStream | null>) => {
  //   selfView ? stream.current?.getTracks().forEach((track) => track.stop()) :
  // }

  const startRecorder = () => {
    // save a new chunk of data every 250ms
    mediaRecorder.current?.start(250)
    // stop the video after three seconds
    setTimeout(() => {
      mediaRecorder.current?.stop()
    }, 1000)
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
      {selfView && (
        <div style={{ height: 720, width: 1280, position: 'relative', background: '#000' }}>
          <video autoPlay muted playsInline controls={false} style={{ transform: 'scaleX(-1)' }} ref={videoElement} />
          <button
            style={{
              background: 'red',
              height: 80,
              width: 80,
              borderRadius: 100,
              border: '2px solid #fff',
              cursor: 'pointer',
              position: 'absolute',
              top: VIDEO_H - (80 + 24),
              left: 'calc(50% - 40px)'
            }}
            onClick={onRecordButtonClick}
          />
        </div>
      )}
      <button
        style={{
          marginTop: 48,
          background: 'violet',
          height: 44,
          width: 120,
          borderRadius: 9,
          border: '2px solid #fff',
          cursor: 'pointer'
        }}
        onClick={() => setSelfView(!selfView)}
      >
        Camera On/Off
      </button>
      <button
        style={{
          marginTop: 48,
          background: 'grey',
          height: 44,
          width: 120,
          borderRadius: 9,
          border: '2px solid #fff',
          cursor: 'pointer'
        }}
        onClick={() => setGallery(null)}
      >
        Reset Gallery
      </button>
      {gallery &&
        gallery.map((item, i) => (
          <p key={`${item.lastModified}-${i}`}>
            {item.name} | {bytesToSize(item.size)}
          </p>
        ))}
    </div>
  )
}
