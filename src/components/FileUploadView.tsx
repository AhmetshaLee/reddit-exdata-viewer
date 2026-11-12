import type { Locale, Messages } from '../i18n'
import styles from '../pages/index.module.css'
import FilePickerButton from './FilePickerButton'
import LanguageSwitcher from './LanguageSwitcher'

type FileUploadViewProps = {
  locale: Locale
  text: Messages
  disabled: boolean
  onFileSelected: (file: File) => void
}

export default function FileUploadView({
  locale,
  text,
  disabled,
  onFileSelected,
}: FileUploadViewProps) {
  return (
    <>
      <div className={styles.uploadIntro}>
        <p className={styles.intro}>{text.intro}</p>
        <LanguageSwitcher locale={locale} />
      </div>
      <section className={styles.dropZone} aria-labelledby="upload-title">
        <h2 className={styles.uploadTitle} id="upload-title">
          {text.uploadTitle}
        </h2>
        <p className={styles.uploadDescription}>{text.uploadDescription}</p>
        <FilePickerButton
          className={styles.uploadButton}
          disabled={disabled}
          onFileSelected={onFileSelected}
        >
          {text.chooseArchive}
        </FilePickerButton>
      </section>
    </>
  )
}
