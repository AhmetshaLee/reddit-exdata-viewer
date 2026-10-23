import {
  DEFAULT_FILTERS,
  type FilterChoice,
  type PostVoteFilters,
} from '../lib/post-vote-filters'
import styles from './post-votes-toolbar.module.css'

type PostVotesToolbarProps = {
  onChooseFile: () => void
  disabled: boolean
  fileName: string
  filters: PostVoteFilters
  voteChoices: FilterChoice[]
  communityChoices: FilterChoice[]
  totalRecords: number
  matchedRecords: number
  onFiltersChange: (filters: PostVoteFilters) => void
}

export default function PostVotesToolbar({
  onChooseFile,
  disabled,
  fileName,
  filters,
  voteChoices,
  communityChoices,
  totalRecords,
  matchedRecords,
  onFiltersChange,
}: PostVotesToolbarProps) {
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
          onFiltersChange(DEFAULT_FILTERS)
        }}
      >
        <label className={styles.searchField}>
          <span>Поиск</span>
          <input
            className={styles.search}
            type="search"
            name="search"
            placeholder="ID, ссылка или название из slug"
            value={filters.query}
            disabled={disabled}
            onChange={(event) =>
              onFiltersChange({ ...filters, query: event.currentTarget.value })
            }
          />
        </label>
        <div className={styles.filterRow}>
          <details>
            <summary className={styles.summary}>Фильтры</summary>
            <div className={styles.filters}>
              {[
                {
                  name: 'direction',
                  legend: 'Оценки',
                  choices: voteChoices,
                  selected: filters.direction,
                },
                {
                  name: 'community',
                  legend: 'Сабреддиты',
                  choices: communityChoices,
                  selected: filters.community,
                },
              ].map(({ name, legend, choices, selected }) => (
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
                          onChange={() =>
                            onFiltersChange({ ...filters, [name]: value })
                          }
                        />
                        <span className={styles.chip}>
                          <span>{label}</span>
                          <span className={styles.count}>{count}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </details>
          <div className={styles.resetAction}>
            <button
              className={styles.textButton}
              type="reset"
              disabled={disabled}
            >
              Сбросить фильтры
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
