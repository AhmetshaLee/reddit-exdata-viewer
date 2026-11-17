import type { CommentEntry } from '../lib/comment-list'
import { getVoteLabel, type Messages } from '../i18n'
import styles from './comments.module.css'

export default function CommentCard({
  entry,
  text,
}: {
  entry: CommentEntry
  text: Messages
}) {
  const { record, href, communityLabel, parentTitle } = entry
  const content = (
    <>
      <p className={styles.community}>
        {communityLabel || text.unknownCommunity}
      </p>
      <h2 className={styles.title}>{text.commentTitle(record.id)}</h2>
      <p className={styles.description}>{text.missingBody}</p>
      {parentTitle && (
        <p className={styles.parent} title={parentTitle}>
          {text.parentPost(parentTitle)}
        </p>
      )}
      {'direction' in record && (
        <p className={styles.direction}>
          {text.yourVote(getVoteLabel(record.direction, text))}
        </p>
      )}
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
