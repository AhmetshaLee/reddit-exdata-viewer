import { parseCsv } from './csv'
import { ReaderError } from './reader-error'

export type UserPreference = { preference: string; value: string }

export function parseUserPreferences(text: string): UserPreference[] {
  const records = parseCsv(text, ['preference', 'value'])
  if (
    records.some(
      (row) => !row.preference?.trim() || typeof row.value !== 'string',
    )
  ) {
    throw new ReaderError('invalidPreference')
  }
  return records.map((row) => ({
    preference: row.preference.trim(),
    value: row.value,
  }))
}
