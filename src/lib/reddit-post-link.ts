type RedditPostLink = {
  href: string
  subreddit: string | null
  title: string | null
}

export function getRedditPostLink(permalink: string): RedditPostLink | null {
  let url: URL
  try {
    url = new URL(permalink, 'https://www.reddit.com')
  } catch {
    return null
  }

  const isReddit =
    url.hostname === 'reddit.com' || url.hostname.endsWith('.reddit.com')
  if (url.protocol !== 'https:' || !isReddit || url.username || url.password) {
    return null
  }

  const parts = url.pathname.split('/')
  let subreddit: string | null = null
  let postId = ''
  let slug = ''

  if (
    parts[1]?.toLowerCase() === 'r' &&
    parts[2] &&
    parts[3]?.toLowerCase() === 'comments'
  ) {
    subreddit = parts[2]
    postId = parts[4] ?? ''
    slug = parts[5] ?? ''
  } else if (parts[1]?.toLowerCase() === 'comments') {
    postId = parts[2] ?? ''
    slug = parts[3] ?? ''
  }

  const hasPostId = /^[a-z0-9]+$/i.test(postId)

  if (!hasPostId) {
    subreddit = null
    slug = ''
  }

  let title: string
  try {
    title = decodeURIComponent(slug).replaceAll('_', ' ').trim()
  } catch {
    title = slug.replaceAll('_', ' ').trim()
  }
  title = title.replace(/^./u, (character) => character.toUpperCase())

  return {
    href: url.href,
    subreddit,
    title: title || null,
  }
}
