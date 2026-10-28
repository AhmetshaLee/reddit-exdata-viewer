import { useEffect, useMemo, useState } from 'react'

import { getPageFromHash, PAGE_SIZE } from '../lib/pagination'

type UseListOptions<Record, Filters> = {
  records: Record[]
  initialFilters: Filters
  filterRecords: (records: Record[], filters: Filters) => Record[]
}

function updatePageUrl(
  page: number,
  hasRecords: boolean,
  addToHistory = false,
) {
  const url = hasRecords
    ? `#${page}`
    : window.location.pathname + window.location.search

  if (addToHistory) {
    window.history.pushState(window.history.state, '', url)
  } else {
    window.history.replaceState(window.history.state, '', url)
  }
}

export function useList<Record, Filters>({
  records,
  initialFilters,
  filterRecords,
}: UseListOptions<Record, Filters>) {
  const [state, setState] = useState({ filters: initialFilters, page: 1 })
  const { filters, page } = state

  const filteredRecords = useMemo(
    () => filterRecords(records, filters),
    [records, filters, filterRecords],
  )
  const pageCount = Math.ceil(filteredRecords.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageRecords = filteredRecords.slice(start, start + PAGE_SIZE)
  const hasRecords = records.length > 0

  function changeFilters(nextFilters: Filters) {
    setState({ filters: nextFilters, page: 1 })
    updatePageUrl(1, hasRecords)
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return
    setState((previous) => ({ ...previous, page: nextPage }))
    updatePageUrl(nextPage, hasRecords, true)
  }

  useEffect(() => {
    updatePageUrl(1, hasRecords)
  }, [hasRecords])

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromHash(window.location.hash, pageCount)
      setState((previous) => ({ ...previous, page: nextPage }))
      updatePageUrl(nextPage, hasRecords)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [pageCount, hasRecords])

  return {
    filters,
    page,
    pageCount,
    pageSize: PAGE_SIZE,
    pageRecords,
    matchedRecords: filteredRecords.length,
    changeFilters,
    changePage,
  }
}
