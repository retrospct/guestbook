export function bytesToSize(bytes: number): string {
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export function mediaTypeSupported(passedTypes?: string[]) {
  // list in priority of preferred types to support, manual or default
  const types = passedTypes
    ? passedTypes
    : [
        'video/mp4;codecs=avc1',
        'video/mp4;codecs=h264',
        'video/webm;codecs=avc1',
        'video/webm;codecs=vp9',
        'video/webm;codecs=h264',
        'video/webm',
        'video/mpeg',
        'video/webm;codecs=daala',
        'audio/webm',
        'audio/webm;codecs=opus'
      ]

  // var to store the best supported type to return
  let bestType: string | undefined

  // iterate through the types and check if the browser supports them
  for (let i in types) {
    const typeSupported = MediaRecorder.isTypeSupported(types[i])
    console.log('Is ' + types[i] + ' supported? ' + (typeSupported ? 'Maybe' : 'No'))

    // save the best type if it's supported but allow function to continue iterating
    if (!bestType && typeSupported) bestType = types[i]
  }

  // return the best supported type with a failover value
  return bestType ? bestType : 'video/webm;codecs=avc1'
}
