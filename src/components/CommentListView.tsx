import type { CommentEntry } from '../lib/comment-list'
import type { ListFilters } from '../lib/list-filters'
import type { FilterChoice } from '../lib/filter-choices'
import CommentCard from './CommentCard'
import ReaderToolbar, { type ReaderFilterGroup } from './ReaderToolbar'
import ReaderListFrame from './ReaderListFrame'
import styles from './comments.module.css'

type CommentListViewProps = {
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
      legend: 'Сабреддиты',
      choices: communityChoices,
      selected: filters.community,
      onChange: (community) => onFiltersChange({ ...filters, community }),
    },
  ]
  if (voteChoices) {
    groups.unshift({
      name: 'direction',
      legend: 'Оценки',
      choices: voteChoices,
      selected: filters.direction ?? 'all',
      onChange: (direction) => onFiltersChange({ ...filters, direction }),
    })
  }

  return (
    <ReaderListFrame
      totalRecords={totalRecords}
      matchedRecords={matchedRecords}
      emptyMessage="В файле нет комментариев"
      toolbar={
        <ReaderToolbar
          search={{ query, onChange: onQueryChange }}
          searchPlaceholder="Поиск по ID, ссылке или названию публикации"
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
          <CommentCard key={entry.sourceIndex} entry={entry} />
        ))}
      </ol>
    </ReaderListFrame>
  )
}
