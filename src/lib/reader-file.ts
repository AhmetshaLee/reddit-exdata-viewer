import {
  DEFAULT_POST_FILTERS,
  DEFAULT_VOTE_FILTERS,
  type PostFilters,
} from './post-list'
import type { RedditFileData } from './read-reddit-source'

export type ReaderConditions = {
  query: string
  filters: PostFilters
  page: number
}

export type ReaderFile = {
  file: RedditFileData
  conditions: ReaderConditions
}

export function createConditions(
  type: RedditFileData['type'],
): ReaderConditions {
  return {
    query: '',
    filters:
      type === 'post-votes' ? DEFAULT_VOTE_FILTERS : DEFAULT_POST_FILTERS,
    page: 1,
  }
}

export function createReaderFiles(files: RedditFileData[]): ReaderFile[] {
  return files.map((file) => ({
    file,
    conditions: createConditions(file.type),
  }))
}
