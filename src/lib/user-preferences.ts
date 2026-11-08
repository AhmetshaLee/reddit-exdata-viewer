import { parseCsv } from './csv'

export type UserPreference = { preference: string; value: string }

export function parseUserPreferences(text: string): UserPreference[] {
  const records = parseCsv(text, ['preference', 'value'])
  if (
    records.some(
      (row) => !row.preference?.trim() || typeof row.value !== 'string',
    )
  ) {
    throw new Error('В CSV есть запись без имени параметра или значения.')
  }
  return records.map((row) => ({
    preference: row.preference.trim(),
    value: row.value,
  }))
}
