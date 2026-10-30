import {
  DEFAULT_FILTERS,
  type FilterChoice,
  type PostVoteFilters,
} from '../lib/post-vote-filters'
import FilePickerButton from './FilePickerButton'
import styles from './reader-toolbar.module.css'

export type PostVoteFiltering = {
  values: PostVoteFilters
  voteChoices: FilterChoice[]
  communityChoices: FilterChoice[]
  onChange: (values: PostVoteFilters) => void
}

type ReaderToolbarProps = {
  onFileSelected: (file: File) => void
  disabled: boolean
  fileName: string
  query: string
  onQueryChange: (query: string) => void
  filtering: PostVoteFiltering
  totalRecords: number
  matchedRecords: number
}

export default function ReaderToolbar({
  onFileSelected,
  disabled,
  fileName,
  query,
  onQueryChange,
  filtering,
  totalRecords,
  matchedRecords,
}: ReaderToolbarProps) {
  const { values, voteChoices, communityChoices, onChange } = filtering
  const groups = [
    {
      name: 'direction',
      legend: 'Оценки',
      choices: voteChoices,
      selected: values.direction,
      onChange: (direction: string) => onChange({ ...values, direction }),
    },
    {
      name: 'community',
      legend: 'Сабреддиты',
      choices: communityChoices,
      selected: values.community,
      onChange: (community: string) => onChange({ ...values, community }),
    },
  ]

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
          onQueryChange('')
          onChange(DEFAULT_FILTERS)
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
