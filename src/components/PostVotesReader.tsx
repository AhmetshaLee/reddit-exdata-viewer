import { useRef, useState, type ChangeEvent } from 'react'

import { readPostVotes, type PostVote } from '../lib/post-votes'
import layout from '../pages/index.module.css'
import PostVoteCard from './PostVoteCard'
import styles from './post-votes.module.css'

type OpenedVotes = {
  fileName: string
  records: PostVote[]
}

export default function PostVotesReader() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState<OpenedVotes | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState('')

  const records = opened?.records ?? []

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    setIsReading(true)
    setError('')
    try {
      const records = await readPostVotes(file)
      setOpened({ fileName: file.name, records })
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Не удалось открыть файл.',
      )
    } finally {
      setIsReading(false)
    }
  }

  const chooseFile = () => fileInput.current?.click()

  return (
    <>
      <h1 className={layout.title}>{opened ? 'Оценки' : 'Ваш архив Reddit'}</h1>
      <input
        ref={fileInput}
        type="file"
        accept=".csv,text/csv"
        hidden
        disabled={isReading}
        onChange={handleFileChange}
      />

      {opened ? (
        <div className={styles.toolbar}>
          <p className={styles.fileName}>
            {opened.fileName} · Записей: {records.length}
          </p>
          <button
            className={styles.button}
            type="button"
            disabled={isReading}
            onClick={chooseFile}
          >
            Открыть другой файл
          </button>
        </div>
      ) : (
        <>
          <p className={layout.intro}>
            Откройте архив, чтобы просматривать свои данные в удобном виде
          </p>
          <section className={layout.dropZone} aria-labelledby="upload-title">
            <h2 className={layout.uploadTitle} id="upload-title">
              Перетащите архив сюда
            </h2>
            <p className={layout.uploadDescription}>
              или выберите файл на компьютере
            </p>
            <button
              className={layout.uploadButton}
              type="button"
              disabled={isReading}
              onClick={chooseFile}
            >
              Выбрать архив
            </button>
          </section>
        </>
      )}

      {isReading && (
        <p className={styles.message} role="status">
          Чтение файла…
        </p>
      )}
      {error && (
        <p className={styles.message} role="alert">
          {error}
        </p>
      )}
      {opened && records.length === 0 && (
        <p className={styles.message}>В файле нет оценок</p>
      )}

      <ol className={styles.cards} aria-label="Оценки постов">
        {records.map((vote, index) => (
          <PostVoteCard key={`${vote.id}-${index}`} vote={vote} />
        ))}
      </ol>
    </>
  )
}
