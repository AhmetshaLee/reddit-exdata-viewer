import type { ReactNode } from 'react'
import styles from './reader-results.module.css'

type ReaderListFrameProps = {
  totalRecords: number
  matchedRecords: number
  emptyMessage: string
  toolbar: ReactNode
  children: ReactNode
}

export default function ReaderListFrame({
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
          <p className={styles.emptyMessage}>
            По выбранным условиям ничего не найдено
          </p>
          <div className={styles.emptyIllustration} aria-hidden="true" />
        </div>
      )}
      {children}
    </>
  )
}
