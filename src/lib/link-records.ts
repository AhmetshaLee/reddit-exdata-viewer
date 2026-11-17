import { parseCsv } from './csv'
import { ReaderError } from './reader-error'

export type LinkRecord = { id: string; permalink: string }

export function parseLinkRecords(text: string): LinkRecord[] {
  const rows = parseCsv(text, ['id', 'permalink'])
  if (rows.some((row) => !row.id?.trim() || !row.permalink?.trim())) {
    throw new ReaderError('invalidLink')
  }
  return rows.map((row) => ({
    id: row.id.trim(),
    permalink: row.permalink.trim(),
  }))
}
