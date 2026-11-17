import type { PostEntry } from '../lib/post-list'
import { getVoteLabel, type Messages } from '../i18n'
import styles from './posts.module.css'

export default function PostCard({
  post,
  text,
}: {
  post: PostEntry
  text: Messages
}) {
  const { record, href, title: sourceTitle, communityLabel } = post
  const title = sourceTitle ?? text.postTitle(record.id)
  const directionLabel =
    record.direction !== undefined ? getVoteLabel(record.direction, text) : null

  const content = (
    <>
      <p
        className={styles.subreddit}
        title={communityLabel || text.unknownCommunity}
      >
        {communityLabel || text.unknownCommunity}
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
            title={text.yourVote(directionLabel ?? '')}
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
