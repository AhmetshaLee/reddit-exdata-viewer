import { getRedditPostLink } from './reddit-post-link'

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
