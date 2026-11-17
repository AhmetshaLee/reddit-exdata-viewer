import type { ReactNode } from 'react'

import type { Messages } from '../i18n'
import styles from './reader-results.module.css'

type ReaderListFrameProps = {
  text: Messages
  totalRecords: number
  matchedRecords: number
  emptyMessage: string
  toolbar: ReactNode
  children: ReactNode
}

export default function ReaderListFrame({
  text,
  totalRecords,
  matchedRecords,
  emptyMessage,
  toolbar,
  children,
}: ReaderListFrameProps) {
  return (
    <>
      {toolbar}
      <hr className={styles.listDivider} />
      {totalRecords === 0 && <p className={styles.message}>{emptyMessage}</p>}
      {totalRecords > 0 && matchedRecords === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>{text.empty}</p>
          <div className={styles.emptyIllustration} aria-hidden="true" />
        </div>
      )}
      {children}
    </>
  )
}
