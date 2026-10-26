import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { getPageFromHash, PAGE_SIZE } from '../lib/pagination'
import {
  DEFAULT_FILTERS,
  filterPostVotes,
  getCommunityChoices,
  getVoteChoices,
  preparePostVotes,
  type PostVoteFilters,
} from '../lib/post-vote-filters'
import type { PostVote } from '../lib/post-votes'
import layout from '../pages/index.module.css'
import PostCard from './PostCard'
import ReaderLayout from './ReaderLayout'
import ReaderPagination from './ReaderPagination'
import ReaderToolbar from './ReaderToolbar'
import styles from './posts.module.css'

type PostVotesViewProps = {
  votes: PostVote[]
  fileName: string
  menu: ReactNode
  feedback: ReactNode
  isReading: boolean
  onChooseFile: () => void
}

export default function PostVotesView({
  votes,
  fileName,
  menu,
  feedback,
  isReading,
  onChooseFile,
}: PostVotesViewProps) {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const records = useMemo(() => preparePostVotes(votes), [votes])
  const filteredRecords = useMemo(
    () => filterPostVotes(records, filters),
    [records, filters],
  )
  const voteChoices = useMemo(() => getVoteChoices(records), [records])
  const communityChoices = useMemo(
    () => getCommunityChoices(records),
    [records],
  )

  const pageCount = Math.ceil(filteredRecords.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageRecords = filteredRecords.slice(start, start + PAGE_SIZE)

  function resetPage() {
    setPage(1)
    const url = records.length
      ? '#1'
      : window.location.pathname + window.location.search
    window.history.replaceState(window.history.state, '', url)
  }

  function changeFilters(nextFilters: PostVoteFilters) {
    setFilters(nextFilters)
    resetPage()
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return
    window.history.pushState(window.history.state, '', `#${nextPage}`)
    setPage(nextPage)
  }

  useEffect(() => {
    const url = records.length
      ? '#1'
      : window.location.pathname + window.location.search
    window.history.replaceState(window.history.state, '', url)
  }, [records.length])

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

  return (
    <ReaderLayout
      title="Оценки"
      sidebar={
        <>
          {menu}
          {pageCount > 0 && (
            <ReaderPagination
              page={page}
              pageCount={pageCount}
              totalRecords={filteredRecords.length}
              pageSize={PAGE_SIZE}
              onPageChange={changePage}
            />
          )}
        </>
      }
    >
      {feedback}
      {records.length === 0 && (
        <p className={layout.message}>В файле нет оценок</p>
      )}
      <ReaderToolbar
        onChooseFile={onChooseFile}
        disabled={isReading}
        fileName={fileName}
        filters={filters}
        voteChoices={voteChoices}
        communityChoices={communityChoices}
        totalRecords={records.length}
        matchedRecords={filteredRecords.length}
        onFiltersChange={changeFilters}
      />
      <hr className={styles.listDivider} />
      {records.length > 0 && filteredRecords.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            По выбранным условиям ничего не найдено
          </p>
          <div className={styles.emptyIllustration} aria-hidden="true" />
        </div>
      )}
      <ol className={styles.cards} aria-label="Оценки постов" start={start + 1}>
        {pageRecords.map(({ vote, sourceIndex }) => (
          <PostCard key={sourceIndex} post={vote} />
        ))}
      </ol>
    </ReaderLayout>
  )
}
