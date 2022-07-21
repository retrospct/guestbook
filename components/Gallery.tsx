import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Box, Link as ChakraLink, Heading, IconButton, useBreakpointValue, Spinner } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

import { VideoAsset } from '../model'
import { Modal } from './Modal'

const LANDSCAPE_W = 356
const PORTRAIT_W = 200
const CARD_H = 200

interface GalleryProps {
  videos: VideoAsset[]
  processing: boolean
  children?: React.ReactNode
}

export const Gallery = (props: GalleryProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('')
  const gtc = useBreakpointValue({
    base: '100%',
    xs: '100%',
    sm: 'repeat(2, minmax(auto, 1fr))',
    md: 'repeat(3, minmax(auto, 1fr))',
    lg: 'repeat(4, minmax(auto, 1fr))'
  })
  if (props.videos?.length === 0)
    return (
      <div>
        <Heading>{`No videos :(`}</Heading>
      </div>
    )
  return (
    <Box
      display="grid"
      gridTemplateColumns={gtc}
      gridGap={2}
      alignItems="center"
      justifyContent="start"
      alignSelf="center"
    >
      {props.processing && (
        <Spinner justifySelf="center" thickness="3px" speed="0.9s" emptyColor="gray.900" color="white" size="xl" />
      )}
      {props.videos.map((video) => (
        <Link
          key={video.id}
          href={video.playback_ids ? `/videos/${encodeURIComponent(video.playback_ids[0].id)}` : '/videos'}
          passHref
        >
          <ChakraLink lineHeight={0} bg="gray.800" borderRadius={3}>
            <Box position="relative" textAlign="center">
              <Image
                src={
                  video.playback_ids
                    ? `https://image.mux.com/${video.playback_ids[0].id}/animated.gif?width=356&fps=30`
                    : '/vercel.svg'
                }
                objectFit="contain"
                width={video.aspect_ratio === '9:16' ? PORTRAIT_W : LANDSCAPE_W}
                height={CARD_H}
                alt="guestbook entry gif"
                // placeholder="blur"
                // blurDataURL="/vercel.svg"
                style={{ borderRadius: 3 }}
              />
              <Box
                w="100%"
                h="60px"
                position="absolute"
                top={0}
                left={0}
                p={2}
                display="flex"
                justifyContent="flex-end"
              >
                {!video.id || Array.isArray(video.id) ? null : (
                  <IconButton
                    icon={<CloseIcon />}
                    aria-label="Toggle Self View Camera"
                    variant="ghost"
                    colorScheme="gray"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedVideo(video.id)
                      setModalOpen(true)
                    }}
                    size={['xs', 'md']}
                    opacity={0.5}
                  />
                )}
              </Box>
            </Box>
          </ChakraLink>
        </Link>
      ))}
      <Modal
        isOpen={modalOpen}
        onAccept={() => {
          setModalOpen(false)
          deleteVideo(selectedVideo)
          setSelectedVideo('')
        }}
        onClose={() => {
          setModalOpen(false)
          setSelectedVideo('')
        }}
      />
    </Box>
  )
}

const deleteVideo = async (id: string) => {
  console.log('delete video:', id)
  await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
}
