import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { getPageFromHash, PAGE_SIZE } from '../lib/pagination'
import { readPostVotes, type PostVote } from '../lib/post-votes'
import layout from '../pages/index.module.css'
import Pagination from './Pagination'
import PostVoteCard from './PostVoteCard'
import styles from './post-votes.module.css'

type OpenedVotes = {
  fileName: string
  records: PostVote[]
}

export default function PostVotesReader() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState<OpenedVotes | null>(null)
  const [page, setPage] = useState(1)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState('')

  const records = opened?.records ?? []
  const pageCount = Math.ceil(records.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageRecords = records.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    if (pageCount === 0) return

    const handleHashChange = () => {
      const nextPage = getPageFromHash(window.location.hash, pageCount)
      const hash = `#${nextPage}`
      if (window.location.hash !== hash) {
        window.history.replaceState(window.history.state, '', hash)
      }
      setPage(nextPage)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [pageCount])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    setIsReading(true)
    setError('')
    try {
      const records = await readPostVotes(file)
      setOpened({ fileName: file.name, records })
      setPage(1)
      const url = records.length
        ? '#1'
        : window.location.pathname + window.location.search
      window.history.replaceState(window.history.state, '', url)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Не удалось открыть файл.',
      )
    } finally {
      setIsReading(false)
    }
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return
    window.history.pushState(window.history.state, '', `#${nextPage}`)
    setPage(nextPage)
  }

  const chooseFile = () => fileInput.current?.click()

  return (
    <div className={`${layout.container} ${layout.workspace}`}>
      <main className={layout.main}>
        <h1 className={layout.title}>
          {opened ? 'Оценки' : 'Ваш архив Reddit'}
        </h1>
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

        <ol
          className={styles.cards}
          aria-label="Оценки постов"
          start={start + 1}
        >
          {pageRecords.map((vote, index) => (
            <PostVoteCard key={`${vote.id}-${start + index}`} vote={vote} />
          ))}
        </ol>
        <p className={layout.localNote}>Данные не покидают ваше устройство</p>
      </main>

      <aside className={layout.sidebar} aria-label="Панель управления">
        <div className={layout.sidebarPanel}>
          <div className={layout.themeControl}>
            <span>Тема страницы</span>
            <button
              className={layout.themeButton}
              type="button"
              aria-label="Сменить тему страницы"
              disabled
            >
              <span className={layout.themeLight}>С</span>
              <span className={layout.themeDark}>Т</span>
            </button>
          </div>

          <nav aria-label="Разделы архива">
            <ul className={layout.menu}>
              {[
                'Посты',
                'Комментарии',
                'Сообщения',
                'Оценки',
                'Сохранённое',
                'Аккаунт',
                'Настройки',
              ].map((label) => (
                <li key={label}>
                  <button
                    className={layout.menuButton}
                    type="button"
                    aria-label={
                      label === 'Оценки'
                        ? 'Оценки: нравится и не нравится'
                        : undefined
                    }
                    disabled
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={layout.menuHint}>
          Разделы станут доступны после открытия архива
        </p>
        {opened && pageCount > 0 && (
          <Pagination
            page={page}
            pageCount={pageCount}
            totalRecords={records.length}
            pageSize={PAGE_SIZE}
            onPageChange={changePage}
          />
        )}
      </aside>
    </div>
  )
}
