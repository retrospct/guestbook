import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!)

// import { useState, useEffect } from 'react'
// import { createClient } from '@supabase/supabase-js'
// import { User } from '../model'

// export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!)

// /**
//  * @param {number} videoId the currently selected Video
//  */
// export const useStore = () => {
//   const [users] = useState<Map<User, User>>(new Map())
//   const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState(null)
//   const [videos, setVideos] = useState([])
//   const [newVideo, handleNewVideo] = useState(null)
//   const [deletedVideo, handleDeletedVideo] = useState(null)

//   // Load initial data and set up listeners
//   useEffect(() => {
//     // Get Videos
//     fetchVideos(setVideos)
//     // Listen for changes to our users
//     const userListener = supabase
//       .from('users')
//       .on('*', (payload) => handleNewOrUpdatedUser(payload.new))
//       .subscribe()
//     // Listen for new and deleted videos
//     const videoListener = supabase
//       .from('videos')
//       .on('INSERT', (payload) => handleNewVideo(payload.new))
//       .on('DELETE', (payload) => handleDeletedVideo(payload.old))
//       .subscribe()
//     // Cleanup on unmount
//     return () => {
//       userListener.unsubscribe()
//       videoListener.unsubscribe()
//     }
//   }, [])

//   // New video received from Postgres
//   useEffect(() => {
//     if (newVideo) setVideos(videos.concat(newVideo))
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [newVideo])

//   // Deleted video received from postgres
//   useEffect(() => {
//     if (deletedVideo) setVideos(videos.filter((video) => video.id !== deletedVideo.id))
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [deletedVideo])

//   // New or updated user received from Postgres
//   useEffect(() => {
//     if (newOrUpdatedUser) users.set(newOrUpdatedUser.id, newOrUpdatedUser)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [newOrUpdatedUser])

//   return {
//     videos: videos !== null ? videos.sort((a, b) => a.slug.localeCompare(b.slug)) : [],
//     users
//   }
// }

// /**
//  * Fetch a single user
//  * @param {number} userId
//  * @param {function} setState Optionally pass in a hook or callback to set the state
//  */
// export const fetchUser = async (userId, setState) => {
//   try {
//     let { body } = await supabase.from('users').select(`*`).eq('id', userId)
//     let user = body[0]
//     if (setState) setState(user)
//     return user
//   } catch (error) {
//     console.log('error', error)
//   }
// }

// /**
//  * Fetch all roles for the current user
//  * @param {function} setState Optionally pass in a hook or callback to set the state
//  */
// export const fetchUserRoles = async (setState) => {
//   try {
//     let { body } = await supabase.from('user_roles').select(`*`)
//     if (setState) setState(body)
//     return body
//   } catch (error) {
//     console.log('error', error)
//   }
// }

// /**
//  * Fetch all videos
//  * @param {function} setState Optionally pass in a hook or callback to set the state
//  */
// export const fetchVideos = async (setState) => {
//   try {
//     let { body } = await supabase.from('videos').select('*')
//     if (setState) setState(body)
//     return body
//   } catch (error) {
//     console.log('error', error)
//   }
// }

// /**
//  * Insert a new video into the DB
//  * @param {string} slug The video name
//  * @param {number} user_id The video creator
//  */
// export const addVideo = async (slug, user_id) => {
//   try {
//     let { body } = await supabase.from('videos').insert([{ slug, created_by: user_id }])
//     return body
//   } catch (error) {
//     console.log('error', error)
//   }
// }

// /**
//  * Delete a video from the DB
//  * @param {number} video_id
//  */
// export const deleteVideo = async (video_id) => {
//   try {
//     let { body } = await supabase.from('videos').delete().match({ id: video_id })
//     return body
//   } catch (error) {
//     console.log('error', error)
//   }
// }
