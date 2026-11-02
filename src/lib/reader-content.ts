import {
  getCommunityChoices,
  getVoteChoices,
  type FilterChoice,
} from './filter-choices'
import { filterList, type ListFilters } from './list-filters'
import { paginateRecords } from './pagination'
import { preparePosts, type PostEntry } from './post-list'
import type { RedditFileData } from './read-reddit-source'

export type PreparedContent = {
  type: RedditFileData['type']
  records: PostEntry[]
  communityChoices: FilterChoice[]
  voteChoices?: FilterChoice[]
}

export function prepareContent(file: RedditFileData): PreparedContent {
  const records = preparePosts(file.records)
  return {
    type: file.type,
    records,
    communityChoices: getCommunityChoices(records),
    voteChoices:
      file.type === 'post-votes'
        ? getVoteChoices(file.records.map((record) => record.direction))
        : undefined,
  }
}

export function filterContent(
  content: PreparedContent,
  query: string,
  filters: ListFilters,
) {
  return {
    ...content,
    records: filterList(content.records, query, filters),
    filters,
  }
}

export function getContentResult(
  matched: ReturnType<typeof filterContent>,
  totalRecords: number,
  page: number,
) {
  return {
    type: matched.type,
    filters: matched.filters,
    communityChoices: matched.communityChoices,
    voteChoices: matched.voteChoices,
    totalRecords,
    matchedRecords: matched.records.length,
    ...paginateRecords(matched.records, page),
  }
}
