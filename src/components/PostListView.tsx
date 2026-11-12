import { getVoteLabel, type Messages } from '../i18n'
import type { FilterChoice } from '../lib/filter-choices'
import type { ListFilters } from '../lib/list-filters'
import type { PostEntry } from '../lib/post-list'
import PostCard from './PostCard'
import ReaderListFrame from './ReaderListFrame'
import ReaderToolbar, { type ReaderFilterGroup } from './ReaderToolbar'
import styles from './posts.module.css'

type PostListViewProps = {
  text: Messages
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
  text,
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
      emptyMessage={text.emptyPosts}
      toolbar={
        <ReaderToolbar
          text={text}
          search={{ query, onChange: onQueryChange }}
          searchPlaceholder={text.searchPosts}
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
          <PostCard text={text} key={entry.sourceIndex} post={entry} />
        ))}
      </ol>
    </ReaderListFrame>
  )
}
