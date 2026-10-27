import styles from '../pages/index.module.css'

type FileUploadViewProps = {
  disabled: boolean
  onChooseFile: () => void
}

export default function FileUploadView({
  disabled,
  onChooseFile,
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
        <button
          className={styles.uploadButton}
          disabled={disabled}
          type="button"
          onClick={onChooseFile}
        >
          Выбрать архив
        </button>
      </section>
    </>
  )
}
