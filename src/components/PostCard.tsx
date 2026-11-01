import type { PostEntry } from '../lib/post-list'
import styles from './posts.module.css'

const directionLabels: Record<string, string> = {
  up: 'Нравится',
  down: 'Не нравится',
  none: 'Не указана',
}

export default function PostCard({ post }: { post: PostEntry }) {
  const { record, href, title, communityLabel } = post
  let directionLabel = record.direction
  if (
    record.direction !== undefined &&
    Object.hasOwn(directionLabels, record.direction)
  ) {
    directionLabel = directionLabels[record.direction]
  }

  const content = (
    <>
      <p className={styles.subreddit} title={communityLabel}>
        {communityLabel}
      </p>
      <h2 className={styles.cardTitle} title={title}>
        {title}
      </h2>
      <div className={styles.cardMeta}>
        <span className={styles.cardId} title={record.id}>
          #{record.id}
        </span>
        {record.direction !== undefined && (
          <span
            className={styles.direction}
            title={`Ваша оценка: ${directionLabel}`}
          >
            {directionLabel}
          </span>
        )}
      </div>
    </>
  )

  return (
    <li>
      {href ? (
        <a
          className={styles.card}
          href={href}
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
