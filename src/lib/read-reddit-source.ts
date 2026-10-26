import { unzipRaw, type ZipEntry, type ZipInfoRaw } from 'unzipit'

import { parsePostVotes, type PostVote } from './post-votes'

const SUPPORTED_CSV_FILES = ['post_votes.csv']

export type RedditFileData = {
  type: 'post-votes'
  records: PostVote[]
}

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
  if (name === 'post_votes.csv') {
    return { type: 'post-votes', records: parsePostVotes(text) }
  }
  throw new Error(`Файл ${name} не поддерживается.`)
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
      return parseRedditFile(entry.name.toLowerCase(), text)
    }),
  )
}
