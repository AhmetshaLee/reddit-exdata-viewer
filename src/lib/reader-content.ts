import {
  getCommunityChoices,
  getVoteChoices,
  type FilterChoice,
} from './filter-choices'
import {
  DEFAULT_LIST_FILTERS,
  filterList,
  type ListFilters,
} from './list-filters'
import { paginateRecords } from './pagination'
import { preparePosts, type PostEntry } from './post-list'
import type { RedditFileData } from './read-reddit-source'
import { filterPreferences, type UserPreference } from './user-preferences'

type PreparedPosts = {
  type: 'post-votes' | 'saved-posts' | 'hidden-posts'
  records: PostEntry[]
  communityChoices: FilterChoice[]
  voteChoices?: FilterChoice[]
}

export type PreparedContent =
  PreparedPosts | { type: 'user-preferences'; records: UserPreference[] }

export function prepareContent(file: RedditFileData): PreparedContent {
  if (file.type === 'user-preferences') return file
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
  filters: ListFilters | undefined,
) {
  if (content.type === 'user-preferences') {
    return {
      ...content,
      records: filterPreferences(content.records, query),
    }
  }
  const postFilters = filters ?? DEFAULT_LIST_FILTERS
  return {
    ...content,
    records: filterList(content.records, query, postFilters),
    filters: postFilters,
  }
}

export function getContentResult(
  matched: ReturnType<typeof filterContent>,
  totalRecords: number,
  page: number | undefined,
) {
  const counts = {
    totalRecords,
    matchedRecords: matched.records.length,
  }
  if (matched.type === 'user-preferences') {
    return { type: matched.type, records: matched.records, ...counts }
  }
  return {
    type: matched.type,
    filters: matched.filters,
    communityChoices: matched.communityChoices,
    voteChoices: matched.voteChoices,
    ...counts,
    ...paginateRecords(matched.records, page ?? 1),
  }
}
