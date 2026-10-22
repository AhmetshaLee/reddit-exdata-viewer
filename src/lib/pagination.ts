export const PAGE_SIZE = 50

export function getPageFromHash(hash: string, pageCount: number): number {
  const page = /^#[1-9]\d*$/.test(hash) ? Number(hash.slice(1)) : 1
  if (!Number.isSafeInteger(page)) return 1
  return Math.min(page, Math.max(pageCount, 1))
}
