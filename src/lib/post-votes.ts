import Papa from 'papaparse'

export type PostVote = {
  id: string
  permalink: string
  direction: string
}

export function parsePostVotes(text: string): PostVote[] {
  const result = Papa.parse<PostVote>(text, {
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
  const required = ['id', 'permalink', 'direction']
  if (
    columns.length !== required.length ||
    !required.every((name) => columns.includes(name))
  ) {
    throw new Error('Нужен CSV с колонками id, permalink и direction.')
  }

  if (
    result.data.some(
      (vote) =>
        !vote.id?.trim() || !vote.permalink?.trim() || !vote.direction?.trim(),
    )
  ) {
    throw new Error('В CSV есть запись без ID, ссылки или оценки.')
  }

  return result.data.map((vote) => ({
    id: vote.id.trim(),
    permalink: vote.permalink.trim(),
    direction: vote.direction.trim(),
  }))
}
