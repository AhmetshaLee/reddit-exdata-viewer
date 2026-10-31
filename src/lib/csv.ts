import Papa from 'papaparse'

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
    throw new Error(
      'Не удалось разобрать CSV. Проверьте разделители и кавычки.',
    )
  }
  const columns = result.meta.fields ?? []
  if (
    columns.length !== required.length ||
    !required.every((name) => columns.includes(name))
  ) {
    throw new Error('Нужен CSV с колонками ' + required.join(', ') + '.')
  }
  return result.data
}
