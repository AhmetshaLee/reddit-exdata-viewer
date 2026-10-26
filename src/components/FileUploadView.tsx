import type { ReactNode } from 'react'

import styles from '../pages/index.module.css'
import ReaderLayout from './ReaderLayout'

type FileUploadViewProps = {
  menu: ReactNode
  feedback: ReactNode
  isReading: boolean
  onChooseFile: () => void
}

export default function FileUploadView({
  menu,
  feedback,
  isReading,
  onChooseFile,
}: FileUploadViewProps) {
  return (
    <ReaderLayout title="Ваш архив Reddit" sidebar={menu}>
      <p className={styles.intro}>
        Откройте архив, чтобы просматривать свои данные в удобном виде
      </p>
      <section className={styles.dropZone} aria-labelledby="upload-title">
        <h2 className={styles.uploadTitle} id="upload-title">
          Перетащите архив сюда
        </h2>
        <p className={styles.uploadDescription}>
          или выберите файл на компьютере
        </p>
        <button
          className={styles.uploadButton}
          type="button"
          disabled={isReading}
          onClick={onChooseFile}
        >
          Выбрать архив
        </button>
      </section>
      {feedback}
    </ReaderLayout>
  )
}
