import { useEffect, useRef, useState, type DragEvent } from 'react'

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
  const dropZone = useRef<HTMLElement>(null)
  const dragDepth = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMultipleFiles, setHasMultipleFiles] = useState(false)

  function handleDragEnter(event: DragEvent<HTMLElement>) {
    if (!event.dataTransfer.types.includes('Files')) return

    event.preventDefault()
    if (disabled) return

    dragDepth.current += 1
    setIsDragging(true)
  }

  function handleDragOver(event: DragEvent<HTMLElement>) {
    if (!event.dataTransfer.types.includes('Files')) return

    event.preventDefault()
    event.dataTransfer.dropEffect = disabled ? 'none' : 'copy'
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    if (!event.dataTransfer.types.includes('Files')) return

    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setIsDragging(false)
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)
    if (disabled) return

    const files = event.dataTransfer.files
    if (files.length === 0) return

    setHasMultipleFiles(files.length > 1)
    if (files.length === 1) onFileSelected(files[0])
  }

  useEffect(() => {
    function preventFileNavigation(event: globalThis.DragEvent) {
      if (!event.dataTransfer?.types.includes('Files')) return

      event.preventDefault()
      if (
        event.target instanceof Node &&
        !dropZone.current?.contains(event.target)
      ) {
        event.dataTransfer.dropEffect = 'none'
      }
    }

    window.addEventListener('dragover', preventFileNavigation)
    window.addEventListener('drop', preventFileNavigation)
    return () => {
      window.removeEventListener('dragover', preventFileNavigation)
      window.removeEventListener('drop', preventFileNavigation)
    }
  }, [])

  return (
    <>
      <div className={styles.uploadIntro}>
        <p className={styles.intro}>{text.intro}</p>
        <LanguageSwitcher locale={locale} />
      </div>
      <section
        ref={dropZone}
        className={styles.dropZone}
        data-dragging={isDragging && !disabled ? 'true' : undefined}
        aria-labelledby="upload-title"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h2 className={styles.uploadTitle} id="upload-title">
          {isDragging && !disabled ? text.dropFile : text.uploadTitle}
        </h2>
        <p className={styles.uploadDescription}>{text.uploadDescription}</p>
        <FilePickerButton
          className={styles.uploadButton}
          disabled={disabled}
          onFileSelected={(file) => {
            setHasMultipleFiles(false)
            onFileSelected(file)
          }}
        >
          {text.chooseArchive}
        </FilePickerButton>
        {hasMultipleFiles && (
          <p className={styles.dropError} role="alert">
            {text.singleFileOnly}
          </p>
        )}
      </section>
    </>
  )
}
