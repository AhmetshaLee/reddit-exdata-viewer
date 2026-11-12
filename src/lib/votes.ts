import { parseCsv } from './csv'
import { ReaderError } from './reader-error'

export type VoteRecord = { id: string; permalink: string; direction: string }

export function parseVotes(text: string): VoteRecord[] {
  const rows = parseCsv(text, ['id', 'permalink', 'direction'])
  if (
    rows.some(
      (row) =>
        !row.id?.trim() || !row.permalink?.trim() || !row.direction?.trim(),
    )
  ) {
    throw new ReaderError('invalidVote')
  }
  return rows.map((row) => ({
    id: row.id.trim(),
    permalink: row.permalink.trim(),
    direction: row.direction.trim(),
  }))
}
