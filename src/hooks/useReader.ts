import { useMemo, useState } from 'react'

import type { ReaderMenuItemId } from '../components/ReaderMenu'
import { PAGE_SIZE } from '../lib/pagination'
import {
  DEFAULT_VOTE_FILTERS,
  filterPosts,
  getCommunityChoices,
  getVoteChoices,
  preparePosts,
  type PostFilters,
} from '../lib/post-list'
import {
  readRedditSource,
  type RedditFileData,
} from '../lib/read-reddit-source'
import {
  createReaderFiles,
  createConditions,
  type ReaderConditions,
  type ReaderFile,
} from '../lib/reader-file'

type OpenedSource = {
  fileName: string
  files: ReaderFile[]
}

const FILE_MENU_ITEMS: Record<RedditFileData['type'], ReaderMenuItemId> = {
  'post-votes': 'post-votes',
  'saved-posts': 'saved',
  'hidden-posts': 'hidden',
}

const FILE_TITLES: Record<RedditFileData['type'], string> = {
  'post-votes': 'Оценки',
  'saved-posts': 'Сохранённые посты',
  'hidden-posts': 'Скрытые посты',
}

export function useReader() {
  const [opened, setOpened] = useState<OpenedSource | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState('')
  const [activeMenuItem, setActiveMenuItem] = useState<ReaderMenuItemId | null>(
    null,
  )

  const selection =
    opened?.files.find(
      (item) => FILE_MENU_ITEMS[item.file.type] === activeMenuItem,
    ) ?? null
  const file = selection?.file
  const query = selection?.conditions.query ?? ''
  const filters = selection?.conditions.filters ?? DEFAULT_VOTE_FILTERS
  const page = selection?.conditions.page ?? 1

  const records = useMemo(() => preparePosts(file?.records ?? []), [file])
  const filteredRecords = useMemo(
    () => filterPosts(records, query, filters),
    [records, query, filters],
  )
  const voteChoices = useMemo(
    () => (file?.type === 'post-votes' ? getVoteChoices(records) : undefined),
    [file, records],
  )
  const communityChoices = useMemo(
    () => getCommunityChoices(records),
    [records],
  )
  const pageCount = Math.ceil(filteredRecords.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageRecords = filteredRecords.slice(start, start + PAGE_SIZE)
  const availableMenuItems: ReaderMenuItemId[] =
    opened?.files.map((item) => FILE_MENU_ITEMS[item.file.type]) ?? []

  async function openFile(file: File) {
    setIsReading(true)
    setError('')
    try {
      const data = await readRedditSource(file)
      const files = createReaderFiles(data)
      setOpened({ fileName: file.name, files })
      const firstFile =
        files.find((item) => item.file.type === 'post-votes') ?? files[0]
      setActiveMenuItem(FILE_MENU_ITEMS[firstFile.file.type])
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

  function changeFilters(filters: PostFilters) {
    updateSelectedConditions((current) => ({ ...current, filters, page: 1 }))
  }

  function resetConditions() {
    if (!selection) return
    updateSelectedConditions(() => createConditions(selection.file.type))
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
          title: FILE_TITLES[selection.file.type],
          query,
          onQueryChange: changeQuery,
          onReset: resetConditions,
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
