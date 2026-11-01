import type { PostEntry } from '../lib/post-list'
import PostCard from './PostCard'
import ReaderToolbar, { type PostFiltering } from './ReaderToolbar'
import styles from './posts.module.css'

type PostListViewProps = {
  title: string
  fileName: string
  query: string
  onQueryChange: (query: string) => void
  onReset: () => void
  filtering: PostFiltering
  totalRecords: number
  matchedRecords: number
  pageRecords: PostEntry[]
  start: number
  disabled: boolean
  onFileSelected: (file: File) => void
}

export default function PostListView({
  title,
  fileName,
  query,
  onQueryChange,
  onReset,
  filtering,
  totalRecords,
  matchedRecords,
  pageRecords,
  start,
  disabled,
  onFileSelected,
}: PostListViewProps) {
  return (
    <>
      {totalRecords === 0 && (
        <p className={styles.message}>В файле нет постов</p>
      )}
      <ReaderToolbar
        query={query}
        onQueryChange={onQueryChange}
        onReset={onReset}
        filtering={filtering}
        fileName={fileName}
        disabled={disabled}
        onFileSelected={onFileSelected}
        totalRecords={totalRecords}
        matchedRecords={matchedRecords}
      />
      <hr className={styles.listDivider} />
      {totalRecords > 0 && matchedRecords === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            По выбранным условиям ничего не найдено
          </p>
          <div className={styles.emptyIllustration} aria-hidden="true" />
        </div>
      )}
      <ol className={styles.cards} aria-label={title} start={start + 1}>
        {pageRecords.map((entry) => (
          <PostCard key={entry.sourceIndex} post={entry} />
        ))}
      </ol>
    </>
  )
}
