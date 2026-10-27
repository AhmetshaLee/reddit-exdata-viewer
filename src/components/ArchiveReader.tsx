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
import FileUploadView from './FileUploadView'
import PostVotesView from './PostVotesView'
import ReaderLayout from './ReaderLayout'
import ReaderMenu, { type ReaderMenuItemId } from './ReaderMenu'
import ReaderPagination from './ReaderPagination'
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
  const [activeMenuItem, setActiveMenuItem] = useState<ReaderMenuItemId | null>(
    null,
  )

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
      setActiveMenuItem('post-votes')
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
  const availableMenuItems: ReaderMenuItemId[] = opened ? ['post-votes'] : []
  const menuHint = opened
    ? 'Доступны данные из открытого файла'
    : 'Пункты меню станут доступны после открытия CSV или ZIP'

  function selectMenuItem(id: ReaderMenuItemId) {
    if (isReading || !availableMenuItems.includes(id)) return
    setActiveMenuItem(id)
  }

  const feedback = (
    <>
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
    </>
  )

  function renderContent() {
    if (!opened) {
      return (
        <>
          <FileUploadView disabled={isReading} onChooseFile={chooseFile} />
          {feedback}
        </>
      )
    }

    switch (activeMenuItem) {
      case 'post-votes':
        return (
          <>
            {feedback}
            <PostVotesView
              fileName={opened.fileName}
              filters={filters}
              voteChoices={voteChoices}
              communityChoices={communityChoices}
              totalRecords={records.length}
              matchedRecords={filteredRecords.length}
              pageRecords={pageRecords}
              start={start}
              disabled={isReading}
              onChooseFile={chooseFile}
              onFiltersChange={changeFilters}
            />
          </>
        )
      default:
        return feedback
    }
  }

  return (
    <ReaderLayout
      title={opened ? 'Оценки' : 'Ваш архив Reddit'}
      menu={
        <>
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

            <ReaderMenu
              activeMenuItem={activeMenuItem}
              availableMenuItems={availableMenuItems}
              disabled={isReading}
              onSelect={selectMenuItem}
            />
          </div>
          <p className={layout.menuHint}>{menuHint}</p>
        </>
      }
      pagination={
        opened &&
        pageCount > 0 && (
          <ReaderPagination
            page={page}
            pageCount={pageCount}
            totalRecords={filteredRecords.length}
            pageSize={PAGE_SIZE}
            onPageChange={changePage}
          />
        )
      }
    >
      <input
        ref={fileInput}
        type="file"
        accept=".csv,.zip,text/csv,application/zip,application/x-zip-compressed"
        hidden
        disabled={isReading}
        onChange={handleFileChange}
      />
      {renderContent()}
    </ReaderLayout>
  )
}
