import Link from 'next/link'
import Image from 'next/image'
import { Link as ChakraLink, Heading } from '@chakra-ui/react'

// import { bytesToSize } from '../utils'

import styles from '../styles/Gallery.module.css'
import { VideoAsset } from '../model'

// TODO: type this to a video asset type
interface GalleryProps {
  videos: VideoAsset[]
  children?: React.ReactNode
}

export const Gallery = (props: GalleryProps) => {
  if (props.videos?.length === 0)
    return (
      <div>
        <Heading>No videos...</Heading>
      </div>
    )
  return (
    <div className={styles.grid}>
      {props.videos.map((video) => (
        <Link
          key={video.id}
          href={video.playback_ids ? `/videos/${encodeURIComponent(video.playback_ids[0].id)}` : '/videos'}
          className={styles.card}
          passHref
        >
          <ChakraLink>
            <div style={{ position: 'relative' }}>
              <Image
                src={
                  video.playback_ids ? `https://image.mux.com/${video.playback_ids[0].id}/animated.gif` : '/vercel.svg'
                }
                width={320}
                height={180}
                alt="guestbook entry gif"
              />
              <div className={styles.cardOverlay}>
                {/* <p>{video.id}</p> */}
                {!video.id || Array.isArray(video.id) ? null : (
                  <button type="button" onClick={(e) => deleteVideo(e, video.id)}>
                    Delete
                  </button>
                )}
                <p>{Math.round(video.duration || 0)}s &rarr;</p>
              </div>
            </div>
          </ChakraLink>
        </Link>
      ))}
    </div>
  )
}

const deleteVideo = async (e: any, id: string) => {
  e.preventDefault()
  console.log('delete:', id)
  await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  // console.log('deleteVideo data: ', data)
}

// export const Gallery = (props: GalleryProps) => {
//   if (props.videos.length === 0) return null
//   return (
//     <div style={{ width: '100%', textAlign: 'center', padding: '2rem 0' }}>
//       {props.children}
//       <div className={styles.grid}>
//         {props.videos.map((video) => (
//           <Link key={video.id} href={`/videos/${encodeURIComponent(video.id)}`} className={styles.card}>
//             <a>
//               <h2>{bytesToSize(video.file.size)} &rarr;</h2>
//               <p>{video.file.name}</p>
//               <p>{video.id}</p>
//             </a>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }
