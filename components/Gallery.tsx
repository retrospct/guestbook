import styles from '../styles/Gallery.module.css'
import { bytesToSize } from '../utils'

interface GalleryProps {
  files?: File[] | null
  children?: React.ReactNode
}

export const Gallery = (props: GalleryProps) => {
  if (!props.files) return null
  return (
    <div className={styles.grid}>
      {props.files.map((file, i) => (
        <a key={`${file.lastModified}-${i}`} href="" className={styles.card}>
          <h2>{bytesToSize(file.size)} &rarr;</h2>
          <p>{file.name}</p>
        </a>
      ))}
    </div>
  )
}
