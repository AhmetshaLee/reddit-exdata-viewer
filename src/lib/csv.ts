import Papa from 'papaparse'

import { ReaderError } from './reader-error'

export function parseCsv(
  text: string,
  required: string[],
): Record<string, string>[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    delimiter: ',',
    skipEmptyLines: true,
    dynamicTyping: false,
  })
  if (result.errors.length > 0) {
    throw new ReaderError('invalidCsv')
  }
  const columns = result.meta.fields ?? []
  if (
    columns.length !== required.length ||
    !required.every((name) => columns.includes(name))
  ) {
    throw new ReaderError('columns', [required.join(', ')])
  }
  return result.data
}
