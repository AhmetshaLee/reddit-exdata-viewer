export const PAGE_SIZE = 50

export function paginateRecords<T>(records: T[], requestedPage: number) {
  const pageCount = Math.ceil(records.length / PAGE_SIZE)
  const page = Math.min(requestedPage, Math.max(pageCount, 1))
  const start = (page - 1) * PAGE_SIZE
  return {
    pageCount,
    page,
    start,
    pageRecords: records.slice(start, start + PAGE_SIZE),
  }
}
