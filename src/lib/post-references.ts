import { parseCsv } from './csv'

export type PostReference = { id: string; permalink: string }

export function parsePostReferences(text: string): PostReference[] {
  const rows = parseCsv(text, ['id', 'permalink'])
  if (rows.some((row) => !row.id?.trim() || !row.permalink?.trim())) {
    throw new Error('В CSV есть запись без ID или ссылки.')
  }
  return rows.map((row) => ({
    id: row.id.trim(),
    permalink: row.permalink.trim(),
  }))
}
