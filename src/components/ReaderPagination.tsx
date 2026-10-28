import styles from './reader-pagination.module.css'

export type ReaderPaginationProps = {
  page: number
  pageCount: number
  totalRecords: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function ReaderPagination({
  page,
  pageCount,
  totalRecords,
  pageSize,
  onPageChange,
}: ReaderPaginationProps) {
  const firstRecord = (page - 1) * pageSize + 1
  const lastRecord = Math.min(page * pageSize, totalRecords)

  return (
    <nav className={styles.panel} aria-label="Пагинация">
      <p className={styles.summary}>
        Страница <strong>{page}</strong> из {pageCount}
      </p>
      <div className={styles.controls}>
        <button
          className={styles.action}
          type="button"
          aria-label="Предыдущая страница"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </button>
        <select
          className={styles.select}
          value={page}
          aria-label="Текущая страница"
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
          aria-label="Следующая страница"
          disabled={page === pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </button>
      </div>
      <p className={styles.caption}>
        {firstRecord}–{lastRecord} из {totalRecords} записей
      </p>
    </nav>
  )
}
