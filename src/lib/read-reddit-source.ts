import { unzipRaw, type ZipEntry, type ZipInfoRaw } from 'unzipit'

import { parseVotes, type VoteRecord } from './votes'
import { parsePostReferences, type PostReference } from './post-references'
import { parseUserPreferences, type UserPreference } from './user-preferences'
import { parseStatistics, type Statistic } from './statistics'

const SUPPORTED_CSV_FILES = [
  'post_votes.csv',
  'comment_votes.csv',
  'saved_posts.csv',
  'hidden_posts.csv',
  'user_preferences.csv',
  'statistics.csv',
]

export type RedditFileData =
  | { type: 'post-votes'; records: VoteRecord[] }
  | { type: 'comment-votes'; records: VoteRecord[] }
  | { type: 'saved-posts'; records: PostReference[] }
  | { type: 'hidden-posts'; records: PostReference[] }
  | { type: 'user-preferences'; records: UserPreference[] }
  | { type: 'statistics'; records: Statistic[] }

export async function readRedditSource(file: File): Promise<RedditFileData[]> {
  const name = file.name.toLowerCase()
  if (SUPPORTED_CSV_FILES.includes(name)) {
    let text: string
    try {
      text = await file.text()
    } catch {
      throw new Error('Не удалось прочитать файл. Выберите его ещё раз.')
    }
    return [parseRedditFile(name, text)]
  }
  if (name.endsWith('.zip')) {
    return readArchive(file)
  }

  throw new Error(
    `Выберите ${SUPPORTED_CSV_FILES.join(', ')} или ZIP-архив выгрузки Reddit.`,
  )
}

function parseRedditFile(name: string, text: string): RedditFileData {
  switch (name) {
    case 'post_votes.csv':
      return { type: 'post-votes', records: parseVotes(text) }
    case 'comment_votes.csv':
      return { type: 'comment-votes', records: parseVotes(text) }
    case 'saved_posts.csv':
      return { type: 'saved-posts', records: parsePostReferences(text) }
    case 'hidden_posts.csv':
      return { type: 'hidden-posts', records: parsePostReferences(text) }
    case 'user_preferences.csv':
      return { type: 'user-preferences', records: parseUserPreferences(text) }
    case 'statistics.csv':
      return { type: 'statistics', records: parseStatistics(text) }
    default:
      throw new Error(`Файл ${name} не поддерживается.`)
  }
}

async function readArchive(file: File): Promise<RedditFileData[]> {
  let archive: ZipInfoRaw
  try {
    archive = await unzipRaw(file)
  } catch {
    throw new Error('Не удалось открыть ZIP-архив. Проверьте выбранный файл.')
  }

  const entries: ZipEntry[] = []
  for (const entry of archive.entries) {
    const name = entry.name.toLowerCase()
    if (!SUPPORTED_CSV_FILES.includes(name)) continue
    if (entries.some((selected) => selected.name.toLowerCase() === name)) {
      throw new Error(
        `В ZIP-архиве найдено несколько ${name}. Откройте нужный CSV отдельно.`,
      )
    }
    entries.push(entry)
  }
  if (entries.length === 0) {
    throw new Error(
      `В ZIP-архиве не найдены поддерживаемые файлы: ${SUPPORTED_CSV_FILES.join(', ')}.`,
    )
  }

  return Promise.all(
    entries.map(async (entry) => {
      let text: string
      try {
        text = await entry.text()
      } catch {
        throw new Error(`Не удалось извлечь ${entry.name} из ZIP-архива.`)
      }
      try {
        return parseRedditFile(entry.name.toLowerCase(), text)
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : 'Не удалось разобрать CSV.'
        throw new Error(`Файл ${entry.name}: ${message}`, { cause })
      }
    }),
  )
}
