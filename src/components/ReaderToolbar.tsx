import styles from './reader-toolbar.module.css'

export type ReaderFilterGroup = {
  name: string
  legend: string
  choices: { value: string; label: string; count: number }[]
  selected: string
  onChange: (value: string) => void
}

type ReaderToolbarProps = {
  onChooseFile: () => void
  disabled: boolean
  fileName: string
  query: string
  filterGroups: ReaderFilterGroup[]
  totalRecords: number
  matchedRecords: number
  onQueryChange: (query: string) => void
  onReset: () => void
}

export default function ReaderToolbar({
  onChooseFile,
  disabled,
  fileName,
  query,
  filterGroups,
  totalRecords,
  matchedRecords,
  onQueryChange,
  onReset,
}: ReaderToolbarProps) {
  return (
    <section className={styles.toolbar} aria-label="Панель поиска и фильтров">
      <div className={styles.documentBar}>
        <div className={styles.documentTab} aria-label="Открытый файл">
          <span className={styles.fileName} title={fileName}>
            {fileName}
          </span>
        </div>
        <button
          className={styles.button}
          type="button"
          onClick={onChooseFile}
          disabled={disabled}
        >
          Открыть файл
        </button>
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
            placeholder="Поиск по названию, ссылке или ID поста"
            value={query}
            disabled={disabled}
            onChange={(event) => onQueryChange(event.currentTarget.value)}
          />
        </label>
        <div className={styles.filterRow}>
          <details>
            <summary className={styles.summary}>Фильтры</summary>
            <div className={styles.filters}>
              {filterGroups.map(
                ({ name, legend, choices, selected, onChange }) => (
                  <fieldset
                    className={styles.group}
                    key={name}
                    disabled={disabled}
                  >
                    <legend>{legend}</legend>
                    <div className={styles.choices}>
                      {choices.map(({ value, label, count }) => (
                        <label className={styles.choice} key={value}>
                          <input
                            className={styles.choiceInput}
                            type="radio"
                            name={name}
                            value={value}
                            checked={selected === value}
                            onChange={() => onChange(value)}
                          />
                          <span className={styles.chip}>
                            <span>{label}</span>
                            <span className={styles.count}>{count}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ),
              )}
            </div>
          </details>
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
