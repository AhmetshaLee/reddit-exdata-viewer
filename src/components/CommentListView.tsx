import { getVoteLabel, type Messages } from '../i18n'
import type { CommentEntry } from '../lib/comment-list'
import type { ListFilters } from '../lib/list-filters'
import type { FilterChoice } from '../lib/filter-choices'
import CommentCard from './CommentCard'
import ReaderToolbar, { type ReaderFilterGroup } from './ReaderToolbar'
import ReaderListFrame from './ReaderListFrame'
import styles from './comments.module.css'

type CommentListViewProps = {
  text: Messages
  title: string
  query: string
  onQueryChange: (query: string) => void
  onReset: () => void
  filters: ListFilters
  onFiltersChange: (filters: ListFilters) => void
  voteChoices?: FilterChoice[]
  communityChoices: FilterChoice[]
  totalRecords: number
  matchedRecords: number
  pageRecords: CommentEntry[]
  start: number
  fileName: string
  disabled: boolean
  onFileSelected: (file: File) => void
}

export default function CommentListView({
  text,
  title,
  query,
  onQueryChange,
  onReset,
  filters,
  onFiltersChange,
  voteChoices,
  communityChoices,
  totalRecords,
  matchedRecords,
  pageRecords,
  start,
  fileName,
  disabled,
  onFileSelected,
}: CommentListViewProps) {
  const groups: ReaderFilterGroup[] = [
    {
      name: 'community',
      legend: text.communities,
      choices: communityChoices.map((choice) => ({
        ...choice,
        label:
          choice.value === 'all'
            ? text.all
            : choice.label || text.unknownCommunity,
      })),
      selected: filters.community,
      onChange: (community) => onFiltersChange({ ...filters, community }),
    },
  ]
  if (voteChoices) {
    groups.unshift({
      name: 'direction',
      legend: text.votesTitle,
      choices: voteChoices.map((choice) => ({
        ...choice,
        label:
          choice.value === 'all' ? text.all : getVoteLabel(choice.value, text),
      })),
      selected: filters.direction ?? 'all',
      onChange: (direction) => onFiltersChange({ ...filters, direction }),
    })
  }

  return (
    <ReaderListFrame
      text={text}
      totalRecords={totalRecords}
      matchedRecords={matchedRecords}
      emptyMessage={text.emptyComments}
      toolbar={
        <ReaderToolbar
          text={text}
          search={{ query, onChange: onQueryChange }}
          searchPlaceholder={text.searchComments}
          groups={groups}
          onReset={onReset}
          fileName={fileName}
          disabled={disabled}
          onFileSelected={onFileSelected}
          totalRecords={totalRecords}
          matchedRecords={matchedRecords}
        />
      }
    >
      <ol className={styles.cards} aria-label={title} start={start + 1}>
        {pageRecords.map((entry) => (
          <CommentCard text={text} key={entry.sourceIndex} entry={entry} />
        ))}
      </ol>
    </ReaderListFrame>
  )
}
