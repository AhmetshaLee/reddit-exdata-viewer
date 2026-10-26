import styles from '../pages/index.module.css'

type ReaderMenuProps = {
  hasFile: boolean
  isReading: boolean
}

export default function ReaderMenu({ hasFile, isReading }: ReaderMenuProps) {
  const items = [
    { label: 'Посты', disabled: true },
    { label: 'Комментарии', disabled: true },
    { label: 'Сообщения', disabled: true },
    {
      label: 'Оценки',
      description: 'Оценки: нравится и не нравится',
      disabled: !hasFile || isReading,
      current: hasFile ? true : undefined,
    },
    { label: 'Сохранённое', disabled: true },
    { label: 'Аккаунт', disabled: true },
    { label: 'Настройки', disabled: true },
  ]
  const hint = hasFile
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
            {items.map(({ label, description, disabled, current }) => (
              <li key={label}>
                <button
                  className={styles.menuButton}
                  type="button"
                  aria-label={description}
                  aria-current={current}
                  disabled={disabled}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className={styles.menuHint}>{hint}</p>
    </>
  )
}
