import type { PostVote } from '../lib/post-votes'
import { getRedditPostLink } from '../lib/reddit-post-link'
import styles from './post-votes.module.css'

const directionLabels: Record<string, string> = {
  up: 'Нравится',
  down: 'Не нравится',
  none: 'Не указана',
}

export default function PostVoteCard({ vote }: { vote: PostVote }) {
  const link = getRedditPostLink(vote.permalink)
  const title = link?.title ?? `Публикация #${vote.id}`
  const directionLabel = Object.hasOwn(directionLabels, vote.direction)
    ? directionLabels[vote.direction]
    : vote.direction

  const content = (
    <>
      <p className={styles.subreddit} title={link?.subreddit ?? undefined}>
        {link?.subreddit ? `r/${link.subreddit}` : 'Сообщество не указано'}
      </p>
      <h2 className={styles.cardTitle} title={title}>
        {title}
      </h2>
      <div className={styles.cardMeta}>
        <span className={styles.cardId} title={vote.id}>
          #{vote.id}
        </span>
        <span
          className={styles.direction}
          title={`Ваша оценка: ${directionLabel}`}
        >
          {directionLabel}
        </span>
      </div>
    </>
  )

  return (
    <li>
      {link ? (
        <a
          className={styles.card}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ) : (
        <div className={styles.card}>{content}</div>
      )}
    </li>
  )
}
