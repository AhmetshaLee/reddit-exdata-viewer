import type { CommentEntry } from '../lib/comment-list'
import { getVoteLabel } from '../lib/votes'
import styles from './comments.module.css'

export default function CommentCard({ entry }: { entry: CommentEntry }) {
  const { record, href, communityLabel, parentTitle } = entry
  const content = (
    <>
      <p className={styles.community}>{communityLabel}</p>
      <h2 className={styles.title}>Комментарий #{record.id}</h2>
      <p className={styles.description}>Текст комментария не включён в файл</p>
      {parentTitle && (
        <p className={styles.parent} title={parentTitle}>
          К публикации: {parentTitle}
        </p>
      )}
      {'direction' in record && (
        <p className={styles.direction}>
          Ваша оценка: {getVoteLabel(record.direction)}
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
