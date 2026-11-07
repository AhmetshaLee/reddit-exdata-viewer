export type ListFilters = { community: string; direction?: string }
export const DEFAULT_LIST_FILTERS: ListFilters = { community: 'all' }
export const DEFAULT_VOTE_FILTERS: ListFilters = {
  ...DEFAULT_LIST_FILTERS,
  direction: 'all',
}

type FilterableEntry = {
  record: { direction?: string }
  community: string
  searchText: string
}

export function filterList<T extends FilterableEntry>(
  records: T[],
  query: string,
  filters: ListFilters,
): T[] {
  const search = query.trim().toLowerCase()
  return records.filter(
    (entry) =>
      (filters.community === 'all' || entry.community === filters.community) &&
      (!filters.direction ||
        filters.direction === 'all' ||
        entry.record.direction === filters.direction) &&
      entry.searchText.includes(search),
  )
}
