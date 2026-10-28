import { getRedditPostLink } from './reddit-post-link'

export type PostListRecord = {
  id: string
  permalink: string
  direction?: string
}

export type PostListFilters = {
  query: string
  direction: string
  community: string
}

export type FilterChoice = {
  value: string
  label: string
  count: number
}

export type PostListEntry = {
  post: PostListRecord
  sourceIndex: number
  community: string
  communityLabel: string
  searchText: string
}

export const DEFAULT_FILTERS: PostListFilters = {
  query: '',
  direction: 'all',
  community: 'all',
}

export function preparePosts(records: PostListRecord[]): PostListEntry[] {
  return records.map((post, sourceIndex) => {
    const link = getRedditPostLink(post.permalink)
    const communityLabel = link?.subreddit
      ? `r/${link.subreddit}`
      : 'Сабреддит не указан'

    return {
      post,
      sourceIndex,
      community: link?.subreddit ? communityLabel.toLowerCase() : 'unknown',
      communityLabel,
      searchText:
        `${post.id} ${post.permalink} ${link?.title ?? ''}`.toLowerCase(),
    }
  })
}

export function filterPosts(
  records: PostListEntry[],
  filters: PostListFilters,
): PostListEntry[] {
  const query = filters.query.trim().toLowerCase()

  return records.filter(
    ({ post, community, searchText }) =>
      (filters.direction === 'all' || post.direction === filters.direction) &&
      (filters.community === 'all' || community === filters.community) &&
      searchText.includes(query),
  )
}

export function getRatingChoices(records: PostListEntry[]): FilterChoice[] {
  let upCount = 0
  let downCount = 0
  for (const { post } of records) {
    if (post.direction === 'up') upCount += 1
    else if (post.direction === 'down') downCount += 1
  }

  return [
    { value: 'all', label: 'Все', count: records.length },
    { value: 'up', label: 'Нравится', count: upCount },
    { value: 'down', label: 'Не нравится', count: downCount },
  ]
}

export function getCommunityChoices(records: PostListEntry[]): FilterChoice[] {
  const communities = new Map<string, FilterChoice>()
  for (const { community, communityLabel } of records) {
    const choice = communities.get(community)
    if (choice) {
      choice.count += 1
    } else {
      communities.set(community, {
        value: community,
        label: communityLabel,
        count: 1,
      })
    }
  }

  const choices = [...communities.values()].sort((first, second) => {
    const countDifference = second.count - first.count
    if (countDifference !== 0) return countDifference
    return first.label.localeCompare(second.label, 'en', {
      sensitivity: 'base',
    })
  })

  return [{ value: 'all', label: 'Все', count: records.length }, ...choices]
}
