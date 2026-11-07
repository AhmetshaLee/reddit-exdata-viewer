import { parseCsv } from './csv'

export type PostVote = {
  id: string
  permalink: string
  direction: string
}

export function parsePostVotes(text: string): PostVote[] {
  const records = parseCsv(text, ['id', 'permalink', 'direction'])

  if (
    records.some(
      (vote) =>
        !vote.id?.trim() || !vote.permalink?.trim() || !vote.direction?.trim(),
    )
  ) {
    throw new Error('В CSV есть запись без ID, ссылки или оценки.')
  }

  return records.map((vote) => ({
    id: vote.id.trim(),
    permalink: vote.permalink.trim(),
    direction: vote.direction.trim(),
  }))
}
