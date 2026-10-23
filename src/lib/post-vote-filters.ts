import type { PostVote } from './post-votes'
import { getRedditPostLink } from './reddit-post-link'

export type PostVoteFilters = {
  query: string
  direction: string
  community: string
}

export type FilterChoice = {
  value: string
  label: string
  count: number
}

export type PostVoteEntry = {
  vote: PostVote
  sourceIndex: number
  community: string
  communityLabel: string
  searchText: string
}

export const DEFAULT_FILTERS: PostVoteFilters = {
  query: '',
  direction: 'all',
  community: 'all',
}

export function preparePostVotes(records: PostVote[]): PostVoteEntry[] {
  return records.map((vote, sourceIndex) => {
    const link = getRedditPostLink(vote.permalink)
    const communityLabel = link?.subreddit
      ? `r/${link.subreddit}`
      : 'Сабреддит не указан'

    return {
      vote,
      sourceIndex,
      community: link?.subreddit ? communityLabel.toLowerCase() : 'unknown',
      communityLabel,
      searchText:
        `${vote.id} ${vote.permalink} ${link?.title ?? ''}`.toLowerCase(),
    }
  })
}

export function filterPostVotes(
  records: PostVoteEntry[],
  filters: PostVoteFilters,
): PostVoteEntry[] {
  const query = filters.query.trim().toLowerCase()

  return records.filter(
    ({ vote, community, searchText }) =>
      (filters.direction === 'all' || vote.direction === filters.direction) &&
      (filters.community === 'all' || community === filters.community) &&
      searchText.includes(query),
  )
}

export function getVoteChoices(records: PostVoteEntry[]): FilterChoice[] {
  let upCount = 0
  let downCount = 0
  for (const { vote } of records) {
    if (vote.direction === 'up') upCount += 1
    else if (vote.direction === 'down') downCount += 1
  }

  return [
    { value: 'all', label: 'Все', count: records.length },
    { value: 'up', label: 'Нравится', count: upCount },
    { value: 'down', label: 'Не нравится', count: downCount },
  ]
}

export function getCommunityChoices(records: PostVoteEntry[]): FilterChoice[] {
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
    if (first.value === 'unknown') return 1
    if (second.value === 'unknown') return -1
    return first.label.localeCompare(second.label, 'en', {
      sensitivity: 'base',
    })
  })

  return [{ value: 'all', label: 'Все', count: records.length }, ...choices]
}
