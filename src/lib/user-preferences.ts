import Papa from 'papaparse'

export type UserPreference = {
  preference: string
  value: string
}

export function parseUserPreferences(text: string): UserPreference[] {
  const result = Papa.parse<UserPreference>(text, {
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
  const required = ['preference', 'value']
  if (
    columns.length !== required.length ||
    !required.every((name) => columns.includes(name))
  ) {
    throw new Error(
      'Нужен user_preferences.csv с колонками preference и value.',
    )
  }

  if (result.data.some((record) => !record.preference?.trim())) {
    throw new Error('В CSV есть запись без названия настройки.')
  }

  return result.data.map((record) => ({
    preference: record.preference.trim(),
    value: record.value,
  }))
}
