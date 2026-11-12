import type { Messages } from '../i18n'
import type { FilterChoice } from '../lib/filter-choices'
import FilePickerButton from './FilePickerButton'
import styles from './reader-toolbar.module.css'

export type ReaderFilterGroup = {
  name: string
  legend: string
  choices: FilterChoice[]
  selected: string
  onChange: (value: string) => void
}

type ReaderToolbarProps = {
  text: Messages
  onFileSelected: (file: File) => void
  disabled: boolean
  fileName: string
  search: { query: string; onChange: (query: string) => void }
  searchPlaceholder: string
  groups?: ReaderFilterGroup[]
  onReset: () => void
  totalRecords: number
  matchedRecords: number
}

export default function ReaderToolbar({
  text,
  onFileSelected,
  disabled,
  fileName,
  search,
  searchPlaceholder,
  groups = [],
  onReset,
  totalRecords,
  matchedRecords,
}: ReaderToolbarProps) {
  return (
    <section className={styles.toolbar} aria-label={text.toolbar}>
      <div className={styles.documentBar}>
        <div className={styles.documentTab} aria-label={text.openedFile}>
          <span className={styles.fileName} title={fileName}>
            {fileName}
          </span>
        </div>
        <FilePickerButton
          className={styles.button}
          disabled={disabled}
          onFileSelected={onFileSelected}
        >
          {text.openFile}
        </FilePickerButton>
      </div>
      <form
        className={styles.filterPanel}
        onSubmit={(event) => event.preventDefault()}
        onReset={(event) => {
          event.preventDefault()
          onReset()
        }}
      >
        <label className={styles.searchField}>
          <span>{text.search}</span>
          <input
            className={styles.search}
            type="search"
            name="search"
            placeholder={searchPlaceholder}
            value={search.query}
            disabled={disabled}
            onChange={(event) => search.onChange(event.currentTarget.value)}
          />
        </label>
        <div className={styles.filterRow}>
          {groups.length > 0 && (
            <details>
              <summary className={styles.summary}>{text.filters}</summary>
              <div className={styles.filters}>
                {groups.map(({ name, legend, choices, selected, onChange }) => (
                  <fieldset
                    className={styles.group}
                    key={name}
                    disabled={disabled}
                  >
                    <legend>{legend}</legend>
                    <div className={styles.choices}>
                      {choices.map((choice) => (
                        <label className={styles.choice} key={choice.value}>
                          <input
                            className={styles.choiceInput}
                            type="radio"
                            name={name}
                            value={choice.value}
                            checked={selected === choice.value}
                            onChange={() => onChange(choice.value)}
                          />
                          <span className={styles.chip}>
                            <span>{choice.label}</span>
                            <span className={styles.count}>{choice.count}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </details>
          )}
          <div className={styles.resetAction}>
            <button
              className={styles.textButton}
              type="reset"
              disabled={disabled}
            >
              {text.reset}
            </button>
          </div>
        </div>
        <p className={styles.resultCount} role="status">
          {text.results(matchedRecords, totalRecords)}
        </p>
      </form>
    </section>
  )
}
