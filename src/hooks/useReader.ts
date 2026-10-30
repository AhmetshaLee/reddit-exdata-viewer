import { useMemo, useState } from 'react'

import type { ReaderMenuItemId } from '../components/ReaderMenu'
import { PAGE_SIZE } from '../lib/pagination'
import {
  DEFAULT_FILTERS,
  filterPostVotes,
  getCommunityChoices,
  getVoteChoices,
  preparePostVotes,
  type PostVoteFilters,
} from '../lib/post-vote-filters'
import type { PostVote } from '../lib/post-votes'
import { readRedditSource } from '../lib/read-reddit-source'

type OpenedVotes = {
  fileName: string
  records: PostVote[]
}

export function useReader() {
  const [opened, setOpened] = useState<OpenedVotes | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [activeMenuItem, setActiveMenuItem] = useState<ReaderMenuItemId | null>(
    null,
  )

  const records = useMemo(
    () => preparePostVotes(opened?.records ?? []),
    [opened],
  )
  const filteredRecords = useMemo(
    () => filterPostVotes(records, query, filters),
    [records, query, filters],
  )
  const voteChoices = useMemo(() => getVoteChoices(records), [records])
  const communityChoices = useMemo(
    () => getCommunityChoices(records),
    [records],
  )
  const pageCount = Math.ceil(filteredRecords.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageRecords = filteredRecords.slice(start, start + PAGE_SIZE)
  const availableMenuItems: ReaderMenuItemId[] = opened ? ['post-votes'] : []

  async function openFile(file: File) {
    setIsReading(true)
    setError('')
    try {
      const data = await readRedditSource(file)
      const records = data[0].records
      setOpened({ fileName: file.name, records })
      setActiveMenuItem('post-votes')
      setQuery('')
      setFilters(DEFAULT_FILTERS)
      setPage(1)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Не удалось открыть файл.',
      )
    } finally {
      setIsReading(false)
    }
  }

  function changeQuery(nextQuery: string) {
    setQuery(nextQuery)
    setPage(1)
  }

  function changeFilters(nextFilters: PostVoteFilters) {
    setFilters(nextFilters)
    setPage(1)
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return
    setPage(nextPage)
  }

  function selectMenuItem(id: ReaderMenuItemId) {
    if (isReading || !availableMenuItems.includes(id)) return
    setActiveMenuItem(id)
  }

  const content =
    opened && activeMenuItem === 'post-votes'
      ? {
          fileName: opened.fileName,
          query,
          onQueryChange: changeQuery,
          filtering: {
            values: filters,
            voteChoices,
            communityChoices,
            onChange: changeFilters,
          },
          totalRecords: records.length,
          matchedRecords: filteredRecords.length,
          pageRecords,
          start,
        }
      : null

  const pagination =
    content && pageCount > 0
      ? {
          page,
          pageCount,
          totalRecords: filteredRecords.length,
          pageSize: PAGE_SIZE,
          onPageChange: changePage,
        }
      : null

  return {
    content,
    pagination,
    activeMenuItem,
    availableMenuItems,
    selectMenuItem,
    openFile,
    hasSource: opened !== null,
    isReading,
    error,
  }
}
