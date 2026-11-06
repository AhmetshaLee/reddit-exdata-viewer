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
import { prepareComments, type CommentEntry } from './comment-list'
import type { RedditFileData } from './read-reddit-source'
import { filterProperties, type PropertyEntry } from './property-list'

type PreparedPosts = {
  type: 'post-votes' | 'saved-posts' | 'hidden-posts'
  records: PostEntry[]
  communityChoices: FilterChoice[]
  voteChoices?: FilterChoice[]
}

export type PreparedContent =
  | PreparedPosts
  | {
      type: 'comment-votes'
      records: CommentEntry[]
      communityChoices: FilterChoice[]
      voteChoices: FilterChoice[]
    }
  | { type: 'user-preferences'; records: PropertyEntry[] }
  | { type: 'statistics'; records: PropertyEntry[] }

export function prepareContent(file: RedditFileData): PreparedContent {
  switch (file.type) {
    case 'user-preferences':
      return {
        type: file.type,
        records: file.records.map((record) => ({
          label: record.preference,
          value: record.value,
        })),
      }
    case 'statistics':
      return {
        type: file.type,
        records: file.records.map((record) => ({
          label: record.statistic,
          value: record.value,
        })),
      }
    case 'comment-votes': {
      const records = prepareComments(file.records)
      return {
        type: file.type,
        records,
        communityChoices: getCommunityChoices(records),
        voteChoices: getVoteChoices(
          file.records.map((record) => record.direction),
        ),
      }
    }
    case 'post-votes':
    case 'saved-posts':
    case 'hidden-posts': {
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
  }
}

export function filterContent(
  content: PreparedContent,
  query: string,
  filters: ListFilters = DEFAULT_LIST_FILTERS,
) {
  switch (content.type) {
    case 'user-preferences':
    case 'statistics':
      return {
        ...content,
        records: filterProperties(content.records, query),
      }
    case 'comment-votes':
      return {
        ...content,
        records: filterList(content.records, query, filters),
        filters,
      }
    case 'post-votes':
    case 'saved-posts':
    case 'hidden-posts':
      return {
        ...content,
        records: filterList(content.records, query, filters),
        filters,
      }
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
  switch (matched.type) {
    case 'user-preferences':
    case 'statistics':
      return { type: matched.type, records: matched.records, ...counts }
    case 'comment-votes':
      return {
        type: matched.type,
        filters: matched.filters,
        communityChoices: matched.communityChoices,
        voteChoices: matched.voteChoices,
        ...counts,
        ...paginateRecords(matched.records, page ?? 1),
      }
    case 'post-votes':
    case 'saved-posts':
    case 'hidden-posts':
      return {
        type: matched.type,
        filters: matched.filters,
        communityChoices: matched.communityChoices,
        voteChoices: matched.voteChoices,
        ...counts,
        ...paginateRecords(matched.records, page ?? 1),
      }
  }
}
