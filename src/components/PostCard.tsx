import type { PostVote } from '../lib/post-votes'
import { getRedditPostLink } from '../lib/reddit-post-link'
import styles from './posts.module.css'

const directionLabels: Record<string, string> = {
  up: 'Нравится',
  down: 'Не нравится',
  none: 'Не указана',
}

export default function PostCard({ post }: { post: PostVote }) {
  const link = getRedditPostLink(post.permalink)
  const title = link?.title ?? `Публикация #${post.id}`
  const directionLabel = Object.hasOwn(directionLabels, post.direction)
    ? directionLabels[post.direction]
    : post.direction

  const content = (
    <>
      <p className={styles.subreddit} title={link?.subreddit ?? undefined}>
        {link?.subreddit ? `r/${link.subreddit}` : 'Сообщество не указано'}
      </p>
      <h2 className={styles.cardTitle} title={title}>
        {title}
      </h2>
      <div className={styles.cardMeta}>
        <span className={styles.cardId} title={post.id}>
          #{post.id}
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
