import Link from 'next/link'
import Image from 'next/image'
import { Link as ChakraLink } from '@chakra-ui/react'

// import { bytesToSize } from '../utils'

import styles from '../styles/Gallery.module.css'

// TODO: type this to a video asset type
interface GalleryProps {
  videos: any[]
  children?: React.ReactNode
}

export const Gallery = (props: GalleryProps) => {
  if (props.videos.length === 0) return null
  return (
    <div className={styles.grid}>
      {props.videos.map((video) => (
        <Link
          key={video.id}
          href={`/videos/${encodeURIComponent(video.playback_ids[0].id)}`}
          className={styles.card}
          passHref
        >
          <ChakraLink>
            <div style={{ position: 'relative' }}>
              <Image
                src={`https://image.mux.com/${video.playback_ids[0].id}/animated.gif`}
                width={320}
                height={180}
                alt="guestbook entry gif"
              />
              <div className={styles.cardOverlay}>
                {/* <p>{video.id}</p> */}
                <p>{Math.round(video.duration)}s &rarr;</p>
              </div>
            </div>
          </ChakraLink>
        </Link>
      ))}
    </div>
  )
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
