import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'

import { getPageFromHash, PAGE_SIZE } from '../lib/pagination'
import {
  DEFAULT_FILTERS,
  filterPostVotes,
  getCommunityChoices,
  getVoteChoices,
  preparePostVotes,
  type PostVoteEntry,
  type PostVoteFilters,
} from '../lib/post-vote-filters'
import { readRedditSource } from '../lib/read-reddit-source'
import layout from '../pages/index.module.css'
import PostCard from './PostCard'
import ReaderPagination from './ReaderPagination'
import ReaderToolbar from './ReaderToolbar'
import styles from './posts.module.css'

type OpenedVotes = {
  fileName: string
  records: PostVoteEntry[]
}

export default function ArchiveReader() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState<OpenedVotes | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState('')

  const records = opened?.records ?? []
  const filteredRecords = useMemo(
    () => filterPostVotes(opened?.records ?? [], filters),
    [opened, filters],
  )
  const voteChoices = useMemo(
    () => getVoteChoices(opened?.records ?? []),
    [opened],
  )
  const communityChoices = useMemo(
    () => getCommunityChoices(opened?.records ?? []),
    [opened],
  )
  const pageCount = Math.ceil(filteredRecords.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageRecords = filteredRecords.slice(start, start + PAGE_SIZE)

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

  useEffect(() => {
    if (!opened) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [opened])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    setIsReading(true)
    setError('')
    try {
      const data = await readRedditSource(file)
      const records = preparePostVotes(data[0].records)
      setOpened({ fileName: file.name, records })
      setFilters(DEFAULT_FILTERS)
      resetPage(records.length)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Не удалось открыть файл.',
      )
    } finally {
      setIsReading(false)
    }
  }

  function resetPage(recordCount: number) {
    setPage(1)
    const url = recordCount
      ? '#1'
      : window.location.pathname + window.location.search
    window.history.replaceState(window.history.state, '', url)
  }

  function changeFilters(nextFilters: PostVoteFilters) {
    setFilters(nextFilters)
    resetPage(records.length)
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return
    window.history.pushState(window.history.state, '', `#${nextPage}`)
    setPage(nextPage)
  }

  const chooseFile = () => fileInput.current?.click()
  const menuItems = [
    { label: 'Посты', disabled: true },
    { label: 'Комментарии', disabled: true },
    { label: 'Сообщения', disabled: true },
    {
      label: 'Оценки',
      description: 'Оценки: нравится и не нравится',
      disabled: !opened || isReading,
      current: opened ? true : undefined,
    },
    { label: 'Сохранённое', disabled: true },
    { label: 'Аккаунт', disabled: true },
    { label: 'Настройки', disabled: true },
  ]
  const menuHint = opened
    ? 'Доступны данные из открытого файла'
    : 'Пункты меню станут доступны после открытия CSV или ZIP'

  return (
    <div className={`${layout.container} ${layout.workspace}`}>
      <main className={layout.main}>
        <h1 className={layout.title}>
          {opened ? 'Оценки' : 'Ваш архив Reddit'}
        </h1>
        <input
          ref={fileInput}
          type="file"
          accept=".csv,.zip,text/csv,application/zip,application/x-zip-compressed"
          hidden
          disabled={isReading}
          onChange={handleFileChange}
        />

        {!opened && (
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

        {opened && (
          <>
            <ReaderToolbar
              onChooseFile={chooseFile}
              disabled={isReading}
              fileName={opened.fileName}
              filters={filters}
              voteChoices={voteChoices}
              communityChoices={communityChoices}
              totalRecords={records.length}
              matchedRecords={filteredRecords.length}
              onFiltersChange={changeFilters}
            />
            <hr className={styles.listDivider} />
          </>
        )}
        {opened && records.length > 0 && filteredRecords.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              По выбранным условиям ничего не найдено
            </p>
            <div className={styles.emptyIllustration} aria-hidden="true" />
          </div>
        )}
        <ol
          className={styles.cards}
          aria-label="Оценки постов"
          start={start + 1}
        >
          {pageRecords.map(({ vote, sourceIndex }) => (
            <PostCard key={sourceIndex} post={vote} />
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

          <hr className={layout.sidebarDivider} />

          <nav aria-label="Разделы архива">
            <ul className={layout.menu}>
              {menuItems.map(({ label, description, disabled, current }) => (
                <li key={label}>
                  <button
                    className={layout.menuButton}
                    type="button"
                    aria-label={description}
                    aria-current={current}
                    disabled={disabled}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={layout.menuHint}>{menuHint}</p>
        {opened && pageCount > 0 && (
          <ReaderPagination
            page={page}
            pageCount={pageCount}
            totalRecords={filteredRecords.length}
            pageSize={PAGE_SIZE}
            onPageChange={changePage}
          />
        )}
      </aside>
    </div>
  )
}
