import { bytesToSize } from '../utils'

import styles from '../styles/Gallery.module.css'

interface GalleryProps {
  files: File[]
  children?: React.ReactNode
}

export const Gallery = (props: GalleryProps) => {
  if (props.files.length === 0) return null
  return (
    <div style={{ width: '100%', textAlign: 'center', padding: '2rem 0' }}>
      {props.children}
      <div className={styles.grid}>
        {props.files.map((file, i) => (
          <a key={`${file.lastModified}-${i}`} href="#" className={styles.card}>
            <h2>{bytesToSize(file.size)} &rarr;</h2>
            <p>{file.name}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
