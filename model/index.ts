export interface FileUpload {
  id: string
  file: File
}

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

export interface VideoAsset {
  tracks?: AssetTrack[]
  status: string
  playback_ids?: AssetPlaybackID[]
  mp4_support: string
  max_stored_resolution?: string
  max_stored_frame_rate?: number
  master_access: string
  id: string
  duration?: number
  created_at: string
  aspect_ratio?: string
}

export interface VideoAssetUpload extends VideoAsset {
  upload_id: string
  non_standard_input_reasons: AssetNonStandardInputReasons
}

export interface VideoAssetData extends VideoAssetUpload {
  test: boolean
}

export interface VideoAssetReadyEvent {
  type: string
  request_id: null
  object: Object
  id: string
  environment: AssetEnvironment
  data: VideoAssetData
  created_at: string
  attempts: any[]
  accessor_source: null
  accessor: null
}

export interface AssetNonStandardInputReasons {
  video_frame_rate: string
  audio_codec: string
}

export interface AssetTrack {
  type: string
  max_width?: number
  max_height?: number
  max_frame_rate?: number
  id: string
  max_channels?: number
  max_channel_layout?: string
  duration?: number
}

export interface AssetEnvironment {
  name: string
  id: string
}

export interface AssetObject {
  type: string
  id: string
}

export interface AssetPlaybackID {
  policy: string
  id: string
}
