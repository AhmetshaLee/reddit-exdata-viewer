import { unzipRaw, type ZipInfoRaw } from 'unzipit'

import { parsePostVotes, readPostVotes, type PostVote } from './post-votes'

export type RedditFileData = {
  type: 'post-votes'
  records: PostVote[]
}

export async function readRedditSource(file: File): Promise<RedditFileData[]> {
  const name = file.name.toLowerCase()
  if (name === 'post_votes.csv') {
    return [{ type: 'post-votes', records: await readPostVotes(file) }]
  }
  if (!name.endsWith('.zip')) {
    throw new Error('Выберите post_votes.csv или ZIP-архив выгрузки Reddit.')
  }

  let archive: ZipInfoRaw
  try {
    archive = await unzipRaw(file)
  } catch {
    throw new Error('Не удалось открыть ZIP-архив. Проверьте выбранный файл.')
  }

  const entries = archive.entries.filter(
    (entry) => entry.name.toLowerCase() === 'post_votes.csv',
  )
  if (entries.length === 0) {
    throw new Error('В ZIP-архиве не найден post_votes.csv.')
  }
  if (entries.length > 1) {
    throw new Error(
      'В ZIP-архиве найдено несколько post_votes.csv. Откройте нужный CSV отдельно.',
    )
  }

  let text: string
  try {
    text = await entries[0].text()
  } catch {
    throw new Error('Не удалось извлечь post_votes.csv из ZIP-архива.')
  }

  return [{ type: 'post-votes', records: parsePostVotes(text) }]
}
