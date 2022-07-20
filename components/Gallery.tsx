import Link from 'next/link'
import Image from 'next/image'
import { Link as ChakraLink, Heading, IconButton } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

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
          <ChakraLink lineHeight={0}>
            <div style={{ position: 'relative' }}>
              <Image
                src={
                  video.playback_ids
                    ? `https://image.mux.com/${video.playback_ids[0].id}/animated.gif?width=356&fps=30`
                    : '/vercel.svg'
                }
                width={356}
                height={200}
                alt="guestbook entry gif"
              />
              <div className={styles.cardOverlay}>
                {!video.id || Array.isArray(video.id) ? null : (
                  <IconButton
                    icon={<CloseIcon />}
                    aria-label="Toggle Self View Camera"
                    variant="ghost"
                    colorScheme="gray"
                    onClick={(e) => deleteVideo(e, video.id)}
                  />
                )}
                {/* <p>{Math.round(video.duration || 0)}s &rarr;</p> */}
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
  console.log('delete video:', id)
  await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
}
