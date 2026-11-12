import type { Messages } from '../i18n'
import styles from './reader-pagination.module.css'

type ReaderPaginationProps = {
  text: Messages
  page: number
  pageCount: number
  totalRecords: number
  pageSize: number
  disabled: boolean
  onPageChange: (page: number) => void
}

export default function ReaderPagination({
  text,
  page,
  pageCount,
  totalRecords,
  pageSize,
  disabled,
  onPageChange,
}: ReaderPaginationProps) {
  const firstRecord = (page - 1) * pageSize + 1
  const lastRecord = Math.min(page * pageSize, totalRecords)

  return (
    <nav className={styles.panel} aria-label={text.pagination}>
      <p className={styles.summary}>
        {text.page} <strong>{page}</strong> {text.of} {pageCount}
      </p>
      <div className={styles.controls}>
        <button
          className={styles.action}
          type="button"
          aria-label={text.previous}
          disabled={disabled || page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </button>
        <select
          className={styles.select}
          value={page}
          disabled={disabled}
          aria-label={text.current}
          onChange={(event) => onPageChange(Number(event.currentTarget.value))}
        >
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (number) => (
              <option value={number} key={number}>
                {number}
              </option>
            ),
          )}
        </select>
        <button
          className={styles.action}
          type="button"
          aria-label={text.next}
          disabled={disabled || page === pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </button>
      </div>
      <p className={styles.caption}>
        {text.range(firstRecord, lastRecord, totalRecords)}
      </p>
    </nav>
  )
}
