import { DEFAULT_FILTERS, type PostVoteFilters } from './post-vote-filters'
import type { RedditFileData } from './read-reddit-source'

export type ReaderConditions = {
  query: string
  filters: PostVoteFilters
  page: number
}

export type ReaderFile = {
  file: RedditFileData
  conditions: ReaderConditions
}

export function createReaderFiles(files: RedditFileData[]): ReaderFile[] {
  return files.map((file) => ({
    file,
    conditions: { query: '', filters: DEFAULT_FILTERS, page: 1 },
  }))
}
