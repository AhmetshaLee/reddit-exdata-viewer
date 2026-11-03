import type { FilterChoice } from '../lib/filter-choices'
import type { ListFilters } from '../lib/list-filters'
import type { PostEntry } from '../lib/post-list'
import PostCard from './PostCard'
import ReaderListFrame from './ReaderListFrame'
import ReaderToolbar, { type ReaderFilterGroup } from './ReaderToolbar'
import styles from './posts.module.css'

type PostListViewProps = {
  title: string
  fileName: string
  query: string
  onQueryChange: (query: string) => void
  onReset: () => void
  filters: ListFilters
  onFiltersChange: (filters: ListFilters) => void
  voteChoices?: FilterChoice[]
  communityChoices: FilterChoice[]
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
  filters,
  onFiltersChange,
  voteChoices,
  communityChoices,
  totalRecords,
  matchedRecords,
  pageRecords,
  start,
  disabled,
  onFileSelected,
}: PostListViewProps) {
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
      emptyMessage="В файле нет постов"
      toolbar={
        <ReaderToolbar
          search={{ query, onChange: onQueryChange }}
          searchPlaceholder="Поиск по названию, ссылке или ID поста"
          onReset={onReset}
          groups={groups}
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
          <PostCard key={entry.sourceIndex} post={entry} />
        ))}
      </ol>
    </ReaderListFrame>
  )
}
