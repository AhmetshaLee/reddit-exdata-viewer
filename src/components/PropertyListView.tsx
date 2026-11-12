import type { Messages } from '../i18n'
import type { PropertyEntry } from '../lib/property-list'
import ReaderListFrame from './ReaderListFrame'
import ReaderToolbar from './ReaderToolbar'
import styles from './property-list.module.css'

type PropertyListViewProps = {
  text: Messages
  records: PropertyEntry[]
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
  text,
  records,
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
      text={text}
      totalRecords={totalRecords}
      matchedRecords={matchedRecords}
      emptyMessage={text.emptyRecords}
      toolbar={
        <ReaderToolbar
          text={text}
          search={{ query, onChange: onQueryChange }}
          searchPlaceholder={text.searchProperties}
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
