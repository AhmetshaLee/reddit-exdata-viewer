import type {
  FilterChoice,
  PostVoteEntry,
  PostVoteFilters,
} from '../lib/post-vote-filters'
import PostCard from './PostCard'
import ReaderToolbar from './ReaderToolbar'
import styles from './posts.module.css'

type PostVotesViewProps = {
  fileName: string
  filters: PostVoteFilters
  voteChoices: FilterChoice[]
  communityChoices: FilterChoice[]
  totalRecords: number
  matchedRecords: number
  pageRecords: PostVoteEntry[]
  start: number
  disabled: boolean
  onFileSelected: (file: File) => void
  onFiltersChange: (filters: PostVoteFilters) => void
}

export default function PostVotesView({
  fileName,
  filters,
  voteChoices,
  communityChoices,
  totalRecords,
  matchedRecords,
  pageRecords,
  start,
  disabled,
  onFileSelected,
  onFiltersChange,
}: PostVotesViewProps) {
  return (
    <>
      {totalRecords === 0 && (
        <p className={styles.message}>В файле нет оценок</p>
      )}
      <ReaderToolbar
        onFileSelected={onFileSelected}
        disabled={disabled}
        fileName={fileName}
        filters={filters}
        voteChoices={voteChoices}
        communityChoices={communityChoices}
        totalRecords={totalRecords}
        matchedRecords={matchedRecords}
        onFiltersChange={onFiltersChange}
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
