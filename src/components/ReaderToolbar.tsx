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
    <section className={styles.toolbar} aria-label="Панель поиска и фильтров">
      <div className={styles.documentBar}>
        <div className={styles.documentTab} aria-label="Открытый файл">
          <span className={styles.fileName} title={fileName}>
            {fileName}
          </span>
        </div>
        <FilePickerButton
          className={styles.button}
          disabled={disabled}
          onFileSelected={onFileSelected}
        >
          Открыть файл
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
          <span>Поиск</span>
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
              <summary className={styles.summary}>Фильтры</summary>
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
              Сбросить
            </button>
          </div>
        </div>
        <p className={styles.resultCount} role="status">
          Найдено: {matchedRecords} из {totalRecords}
        </p>
      </form>
    </section>
  )
}
