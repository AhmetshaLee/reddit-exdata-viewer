import type { PropertyEntry } from '../lib/property-list'
import ReaderListFrame from './ReaderListFrame'
import ReaderToolbar from './ReaderToolbar'
import styles from './property-list.module.css'

type PropertyListViewProps = {
  records: PropertyEntry[]
  searchPlaceholder: string
  emptyMessage: string
  totalRecords: number
  matchedRecords: number
  query: string
  onQueryChange: (query: string) => void
  onReset: () => void
  fileName: string
  disabled: boolean
  onFileSelected: (file: File) => void
}

export default function PropertyListView({
  records,
  searchPlaceholder,
  emptyMessage,
  totalRecords,
  matchedRecords,
  query,
  onQueryChange,
  onReset,
  fileName,
  disabled,
  onFileSelected,
}: PropertyListViewProps) {
  return (
    <ReaderListFrame
      totalRecords={totalRecords}
      matchedRecords={matchedRecords}
      emptyMessage={emptyMessage}
      toolbar={
        <ReaderToolbar
          search={{ query, onChange: onQueryChange }}
          searchPlaceholder={searchPlaceholder}
          onReset={onReset}
          fileName={fileName}
          disabled={disabled}
          onFileSelected={onFileSelected}
          totalRecords={totalRecords}
          matchedRecords={matchedRecords}
        />
      }
    >
      <dl className={styles.list}>
        {records.map(({ label, value }, index) => (
          <div className={styles.item} key={index}>
            <dt className={styles.name}>{label}</dt>
            <dd className={styles.value}>{value === '' ? '—' : value}</dd>
          </div>
        ))}
      </dl>
    </ReaderListFrame>
  )
}
