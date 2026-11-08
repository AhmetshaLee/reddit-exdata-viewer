import { getRedditPostLink } from './reddit-post-link'
import type { VoteRecord } from './votes'
import type { LinkRecord } from './link-records'

export type CommentEntry = {
  record: VoteRecord | LinkRecord
  sourceIndex: number
  href: string | null
  community: string
  communityLabel: string
  parentTitle: string | null
  searchText: string
}

export function prepareComments(
  records: (VoteRecord | LinkRecord)[],
): CommentEntry[] {
  return records.map((record, sourceIndex) => {
    const link = getRedditPostLink(record.permalink)
    const subreddit = link?.subreddit
    const communityLabel = subreddit ? 'r/' + subreddit : 'Сабреддит не указан'
    return {
      record,
      sourceIndex,
      href: link?.href ?? null,
      community: subreddit ? communityLabel.toLowerCase() : 'unknown',
      communityLabel,
      parentTitle: link?.title ?? null,
      searchText: (
        record.id +
        ' ' +
        record.permalink +
        ' ' +
        communityLabel +
        ' ' +
        (link?.title ?? '')
      ).toLowerCase(),
    }
  })
}
