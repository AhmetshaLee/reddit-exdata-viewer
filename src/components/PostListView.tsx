import { useMemo, type ReactNode } from 'react'

import { useList } from '../hooks/useList'
import {
  DEFAULT_FILTERS,
  filterPosts,
  getCommunityChoices,
  getRatingChoices,
  preparePosts,
  type PostListRecord,
} from '../lib/post-list-filters'
import layout from '../pages/index.module.css'
import PostCard from './PostCard'
import ReaderLayout from './ReaderLayout'
import ReaderPagination from './ReaderPagination'
import ReaderToolbar, { type ReaderFilterGroup } from './ReaderToolbar'
import styles from './posts.module.css'

type PostListViewProps = {
  title: string
  listLabel: string
  emptyFileMessage: string
  posts: PostListRecord[]
  showRatingFilter?: boolean
  fileName: string
  isReading: boolean
  onChooseFile: () => void
  menu: ReactNode
  feedback: ReactNode
}

export default function PostListView({
  title,
  listLabel,
  emptyFileMessage,
  posts,
  showRatingFilter = false,
  fileName,
  isReading,
  onChooseFile,
  menu,
  feedback,
}: PostListViewProps) {
  const records = useMemo(() => preparePosts(posts), [posts])
  const ratingChoices = useMemo(() => getRatingChoices(records), [records])
  const communityChoices = useMemo(
    () => getCommunityChoices(records),
    [records],
  )
  const {
    filters,
    page,
    pageCount,
    pageSize,
    pageRecords,
    matchedRecords,
    changeFilters,
    changePage,
  } = useList({
    records,
    initialFilters: DEFAULT_FILTERS,
    filterRecords: filterPosts,
  })

  const filterGroups: ReaderFilterGroup[] = []
  if (showRatingFilter) {
    filterGroups.push({
      name: 'direction',
      legend: 'Оценки',
      choices: ratingChoices,
      selected: filters.direction,
      onChange: (direction) => changeFilters({ ...filters, direction }),
    })
  }
  filterGroups.push({
    name: 'community',
    legend: 'Сабреддиты',
    choices: communityChoices,
    selected: filters.community,
    onChange: (community) => changeFilters({ ...filters, community }),
  })
  const start = (page - 1) * pageSize

  return (
    <ReaderLayout
      title={title}
      sidebar={
        <>
          {menu}
          {pageCount > 0 && (
            <ReaderPagination
              page={page}
              pageCount={pageCount}
              totalRecords={matchedRecords}
              pageSize={pageSize}
              onPageChange={changePage}
            />
          )}
        </>
      }
    >
      {feedback}
      {records.length === 0 && (
        <p className={layout.message}>{emptyFileMessage}</p>
      )}
      <ReaderToolbar
        onChooseFile={onChooseFile}
        disabled={isReading}
        fileName={fileName}
        query={filters.query}
        filterGroups={filterGroups}
        totalRecords={records.length}
        matchedRecords={matchedRecords}
        onQueryChange={(query) => changeFilters({ ...filters, query })}
        onReset={() => changeFilters(DEFAULT_FILTERS)}
      />
      <hr className={styles.listDivider} />
      {records.length > 0 && matchedRecords === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            По выбранным условиям ничего не найдено
          </p>
          <div className={styles.emptyIllustration} aria-hidden="true" />
        </div>
      )}
      <ol className={styles.cards} aria-label={listLabel} start={start + 1}>
        {pageRecords.map(({ post, sourceIndex }) => (
          <PostCard key={sourceIndex} post={post} />
        ))}
      </ol>
    </ReaderLayout>
  )
}
