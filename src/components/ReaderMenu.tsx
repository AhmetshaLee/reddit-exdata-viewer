import type { RedditFileData } from '../lib/read-reddit-source'
import styles from '../pages/index.module.css'

type ReaderMenuItem = {
  label: string
  description?: string
  type?: RedditFileData['type']
}

type ReaderMenuProps = {
  availableTypes: RedditFileData['type'][]
  activeType: RedditFileData['type']
  isReading: boolean
  onFileChange: (type: RedditFileData['type']) => void
}

export default function ReaderMenu({
  availableTypes,
  activeType,
  isReading,
  onFileChange,
}: ReaderMenuProps) {
  const items: ReaderMenuItem[] = [
    { label: 'Посты' },
    { label: 'Комментарии' },
    { label: 'Сообщения' },
    {
      label: 'Оценки',
      description: 'Оценки: нравится и не нравится',
      type: 'post-votes',
    },
    { label: 'Сохранённое' },
    { label: 'Аккаунт' },
    {
      label: 'Настройки',
      type: 'user-preferences',
    },
  ]
  const hint =
    availableTypes.length > 0
      ? 'Доступны данные из открытого файла'
      : 'Пункты меню станут доступны после открытия CSV или ZIP'

  return (
    <>
      <div className={styles.sidebarPanel}>
        <div className={styles.themeControl}>
          <span>Тема страницы</span>
          <button
            className={styles.themeButton}
            type="button"
            aria-label="Сменить тему страницы"
            disabled
          >
            <span className={styles.themeLight}>С</span>
            <span className={styles.themeDark}>Т</span>
          </button>
        </div>

        <hr className={styles.sidebarDivider} />

        <nav aria-label="Разделы архива">
          <ul className={styles.menu}>
            {items.map(({ label, description, type }) => {
              const available =
                type !== undefined && availableTypes.includes(type)

              return (
                <li key={label}>
                  <button
                    className={styles.menuButton}
                    type="button"
                    aria-label={description}
                    aria-current={
                      available && type === activeType ? true : undefined
                    }
                    disabled={isReading || !available}
                    onClick={() => {
                      if (type !== undefined) onFileChange(type)
                    }}
                  >
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <p className={styles.menuHint}>{hint}</p>
    </>
  )
}
