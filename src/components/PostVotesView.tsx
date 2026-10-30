import type { PostVoteEntry } from '../lib/post-vote-filters'
import PostCard from './PostCard'
import ReaderToolbar, { type PostVoteFiltering } from './ReaderToolbar'
import styles from './posts.module.css'

type PostVotesViewProps = {
  fileName: string
  query: string
  onQueryChange: (query: string) => void
  filtering: PostVoteFiltering
  totalRecords: number
  matchedRecords: number
  pageRecords: PostVoteEntry[]
  start: number
  disabled: boolean
  onFileSelected: (file: File) => void
}

export default function PostVotesView({
  fileName,
  query,
  onQueryChange,
  filtering,
  totalRecords,
  matchedRecords,
  pageRecords,
  start,
  disabled,
  onFileSelected,
}: PostVotesViewProps) {
  return (
    <>
      {totalRecords === 0 && (
        <p className={styles.message}>В файле нет оценок</p>
      )}
      <ReaderToolbar
        query={query}
        onQueryChange={onQueryChange}
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
      <ol className={styles.cards} aria-label="Оценки постов" start={start + 1}>
        {pageRecords.map(({ vote, sourceIndex }) => (
          <PostCard key={sourceIndex} post={vote} />
        ))}
      </ol>
    </>
  )
}
