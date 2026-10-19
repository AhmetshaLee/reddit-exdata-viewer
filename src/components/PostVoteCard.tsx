import type { PostVote } from '../lib/post-votes'
import styles from './post-votes.module.css'

const directionLabels: Record<string, string> = {
  up: 'Нравится',
  down: 'Не нравится',
  none: 'Не указана',
}

function getRedditHref(permalink: string): string | null {
  try {
    const url = new URL(permalink, 'https://www.reddit.com')
    const isReddit =
      url.hostname === 'reddit.com' || url.hostname.endsWith('.reddit.com')
    return url.protocol === 'https:' &&
      isReddit &&
      !url.username &&
      !url.password
      ? url.href
      : null
  } catch {
    return null
  }
}

export default function PostVoteCard({ vote }: { vote: PostVote }) {
  const href = getRedditHref(vote.permalink)
  const directionLabel = Object.hasOwn(directionLabels, vote.direction)
    ? directionLabels[vote.direction]
    : vote.direction

  return (
    <li>
      <article className={styles.card}>
        <h2 className={styles.cardTitle}>Пост {vote.id}</h2>
        <p>Ваша оценка: {directionLabel}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {vote.permalink}
          </a>
        ) : (
          <p>{vote.permalink}</p>
        )}
      </article>
    </li>
  )
}
