import type { PostEntry } from '../lib/post-list'
import { getVoteLabel } from '../lib/votes'
import styles from './posts.module.css'

export default function PostCard({ post }: { post: PostEntry }) {
  const { record, href, title, communityLabel } = post
  const directionLabel =
    record.direction !== undefined ? getVoteLabel(record.direction) : null

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
