import { parseCsv } from './csv'

export type VoteRecord = { id: string; permalink: string; direction: string }

export function parseVotes(text: string): VoteRecord[] {
  const rows = parseCsv(text, ['id', 'permalink', 'direction'])
  if (
    rows.some(
      (row) =>
        !row.id?.trim() || !row.permalink?.trim() || !row.direction?.trim(),
    )
  ) {
    throw new Error('В CSV есть запись без ID, ссылки или оценки.')
  }
  return rows.map((row) => ({
    id: row.id.trim(),
    permalink: row.permalink.trim(),
    direction: row.direction.trim(),
  }))
}

const DIRECTION_LABELS: Record<string, string> = {
  up: 'Нравится',
  down: 'Не нравится',
  none: 'Не указана',
}

export function getVoteLabel(direction: string): string {
  return Object.hasOwn(DIRECTION_LABELS, direction)
    ? DIRECTION_LABELS[direction]
    : direction
}
