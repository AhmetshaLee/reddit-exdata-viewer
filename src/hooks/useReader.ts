import { useMemo, useState } from 'react'

import type { ReaderMenuItemId } from '../components/ReaderMenu'
import type { ListFilters } from '../lib/list-filters'
import { filterContent, getContentResult } from '../lib/reader-content'
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
  'comment-votes': 'comment-votes',
  'saved-posts': 'saved-posts',
  'hidden-posts': 'hidden-posts',
  'user-preferences': 'settings',
  statistics: 'statistics',
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
  const filters = selection?.conditions.filters
  const page = selection?.conditions.page

  const matched = useMemo(
    () => (file ? filterContent(file, query, filters) : null),
    [file, query, filters],
  )

  const list =
    file && matched
      ? getContentResult(matched, file.records.length, page)
      : null

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
    updateSelectedConditions((current) =>
      current.page === undefined
        ? { ...current, query }
        : { ...current, query, page: 1 },
    )
  }

  function changeFilters(filters: ListFilters) {
    updateSelectedConditions((current) =>
      current.filters ? { ...current, filters, page: 1 } : current,
    )
  }

  function resetConditions() {
    if (!selection) return
    updateSelectedConditions(() => createConditions(selection.file.type))
  }

  function changePage(nextPage: number) {
    if (
      !list ||
      !('pageCount' in list) ||
      nextPage < 1 ||
      nextPage > list.pageCount ||
      nextPage === list.page
    )
      return
    updateSelectedConditions((current) => ({ ...current, page: nextPage }))
  }

  function selectMenuItem(id: ReaderMenuItemId) {
    if (isReading || !availableMenuItems.includes(id)) return
    setActiveMenuItem(id)
  }

  return {
    source: {
      fileName: opened?.fileName ?? '',
      hasSource: opened !== null,
      isReading,
      error,
      openFile,
    },
    menu: {
      activeMenuItem,
      availableMenuItems,
      selectMenuItem,
    },
    content: {
      selection,
      query,
      list,
      changeFilters,
      changePage,
      changeQuery,
      resetConditions,
    },
  }
}
