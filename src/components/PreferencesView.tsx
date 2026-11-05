import type { UserPreference } from '../lib/user-preferences'
import ReaderListFrame from './ReaderListFrame'
import ReaderToolbar from './ReaderToolbar'
import styles from './preferences.module.css'

type PreferencesViewProps = {
  records: UserPreference[]
  totalRecords: number
  matchedRecords: number
  query: string
  onQueryChange: (query: string) => void
  onReset: () => void
  fileName: string
  disabled: boolean
  onFileSelected: (file: File) => void
}

export default function PreferencesView({
  records,
  totalRecords,
  matchedRecords,
  query,
  onQueryChange,
  onReset,
  fileName,
  disabled,
  onFileSelected,
}: PreferencesViewProps) {
  return (
    <ReaderListFrame
      totalRecords={totalRecords}
      matchedRecords={matchedRecords}
      emptyMessage="В файле нет настроек"
      toolbar={
        <ReaderToolbar
          search={{ query, onChange: onQueryChange }}
          searchPlaceholder="Поиск по параметру или значению"
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
        {records.map(({ preference, value }, index) => (
          <div className={styles.item} key={index}>
            <dt className={styles.name}>{preference}</dt>
            <dd className={styles.value}>{value === '' ? '—' : value}</dd>
          </div>
        ))}
      </dl>
    </ReaderListFrame>
  )
}
