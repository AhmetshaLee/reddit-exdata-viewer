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
import { readRedditSource } from '../lib/read-reddit-source'
import {
  createReaderFiles,
  type ReaderConditions,
  type ReaderFile,
} from '../lib/reader-file'

type OpenedSource = {
  fileName: string
  files: ReaderFile[]
}

export function useReader() {
  const [opened, setOpened] = useState<OpenedSource | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState('')
  const [activeMenuItem, setActiveMenuItem] = useState<ReaderMenuItemId | null>(
    null,
  )

  const selection =
    opened?.files.find((item) => item.file.type === activeMenuItem) ?? null
  const file = selection?.file
  const query = selection?.conditions.query ?? ''
  const filters = selection?.conditions.filters ?? DEFAULT_FILTERS
  const page = selection?.conditions.page ?? 1

  const records = useMemo(() => preparePostVotes(file?.records ?? []), [file])
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
  const availableMenuItems: ReaderMenuItemId[] =
    opened?.files.map((item) => item.file.type) ?? []

  async function openFile(file: File) {
    setIsReading(true)
    setError('')
    try {
      const data = await readRedditSource(file)
      const files = createReaderFiles(data)
      setOpened({ fileName: file.name, files })
      setActiveMenuItem(files[0].file.type)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Не удалось открыть файл.',
      )
    } finally {
      setIsReading(false)
    }
  }

  function updateSelectedConditions(
    update: (conditions: ReaderConditions) => ReaderConditions,
  ) {
    if (!selection) return
    const type = selection.file.type
    setOpened((previous) => {
      if (!previous) return previous
      return {
        ...previous,
        files: previous.files.map((item) =>
          item.file.type === type
            ? { ...item, conditions: update(item.conditions) }
            : item,
        ),
      }
    })
  }

  function changeQuery(query: string) {
    updateSelectedConditions((current) => ({ ...current, query, page: 1 }))
  }

  function changeFilters(filters: PostVoteFilters) {
    updateSelectedConditions((current) => ({ ...current, filters, page: 1 }))
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return
    updateSelectedConditions((current) => ({ ...current, page: nextPage }))
  }

  function selectMenuItem(id: ReaderMenuItemId) {
    if (isReading || !availableMenuItems.includes(id)) return
    setActiveMenuItem(id)
  }

  const content =
    opened && selection
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
