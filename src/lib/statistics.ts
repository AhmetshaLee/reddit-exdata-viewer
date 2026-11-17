import { parseCsv } from './csv'
import { ReaderError } from './reader-error'

export type Statistic = { statistic: string; value: string }

export function parseStatistics(text: string): Statistic[] {
  const records = parseCsv(text, ['statistic', 'value'])
  if (
    records.some(
      (row) => !row.statistic?.trim() || typeof row.value !== 'string',
    )
  ) {
    throw new ReaderError('invalidStatistic')
  }
  return records.map((row) => ({
    statistic: row.statistic.trim(),
    value: row.value,
  }))
}
