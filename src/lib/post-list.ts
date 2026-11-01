import { getRedditPostLink } from './reddit-post-link'

export type PostFilters = {
  direction?: string
  community: string
}

export type FilterChoice = {
  value: string
  label: string
  count: number
}

export type PostRecord = { id: string; permalink: string; direction?: string }

export type PostEntry = {
  record: PostRecord
  sourceIndex: number
  href: string | null
  title: string
  community: string
  communityLabel: string
  searchText: string
}

export const DEFAULT_POST_FILTERS: PostFilters = { community: 'all' }

export const DEFAULT_VOTE_FILTERS: PostFilters = {
  direction: 'all',
  community: 'all',
}

export function preparePosts(records: PostRecord[]): PostEntry[] {
  return records.map((record, sourceIndex) => {
    const link = getRedditPostLink(record.permalink)
    const communityLabel = link?.subreddit
      ? `r/${link.subreddit}`
      : 'Сабреддит не указан'

    return {
      record,
      sourceIndex,
      href: link?.href ?? null,
      title: link?.title ?? `Публикация #${record.id}`,
      community: link?.subreddit ? communityLabel.toLowerCase() : 'unknown',
      communityLabel,
      searchText:
        `${record.id} ${record.permalink} ${link?.title ?? ''}`.toLowerCase(),
    }
  })
}

export function filterPosts(
  records: PostEntry[],
  query: string,
  filters: PostFilters,
): PostEntry[] {
  const search = query.trim().toLowerCase()

  return records.filter(
    ({ record, community, searchText }) =>
      (!filters.direction ||
        filters.direction === 'all' ||
        record.direction === filters.direction) &&
      (filters.community === 'all' || community === filters.community) &&
      searchText.includes(search),
  )
}

export function getVoteChoices(records: PostEntry[]): FilterChoice[] {
  let upCount = 0
  let downCount = 0
  for (const { record } of records) {
    if (record.direction === 'up') upCount += 1
    else if (record.direction === 'down') downCount += 1
  }

  return [
    { value: 'all', label: 'Все', count: records.length },
    { value: 'up', label: 'Нравится', count: upCount },
    { value: 'down', label: 'Не нравится', count: downCount },
  ]
}

export function getCommunityChoices(records: PostEntry[]): FilterChoice[] {
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
