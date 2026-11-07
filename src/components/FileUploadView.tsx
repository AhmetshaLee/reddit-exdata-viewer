import styles from '../pages/index.module.css'
import FilePickerButton from './FilePickerButton'

type FileUploadViewProps = {
  disabled: boolean
  onFileSelected: (file: File) => void
}

export default function FileUploadView({
  disabled,
  onFileSelected,
}: FileUploadViewProps) {
  return (
    <>
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
        <FilePickerButton
          className={styles.uploadButton}
          disabled={disabled}
          onFileSelected={onFileSelected}
        >
          Выбрать архив
        </FilePickerButton>
      </section>
    </>
  )
}
