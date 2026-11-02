import {
  DEFAULT_LIST_FILTERS,
  DEFAULT_VOTE_FILTERS,
  type ListFilters,
} from './list-filters'
import type { RedditFileData } from './read-reddit-source'
import { prepareContent, type PreparedContent } from './reader-content'

export type ReaderConditions = {
  query: string
  filters: ListFilters
  page: number
}

export type ReaderFile = {
  file: PreparedContent
  conditions: ReaderConditions
}

export function createConditions(
  type: RedditFileData['type'],
): ReaderConditions {
  return {
    query: '',
    filters:
      type === 'post-votes' ? DEFAULT_VOTE_FILTERS : DEFAULT_LIST_FILTERS,
    page: 1,
  }
}

export function createReaderFiles(files: RedditFileData[]): ReaderFile[] {
  return files.map((file) => ({
    file: prepareContent(file),
    conditions: createConditions(file.type),
  }))
}
