import styles from '../pages/index.module.css'

export type ReaderMenuItemId =
  | 'posts'
  | 'comments'
  | 'messages'
  | 'post-votes'
  | 'comment-votes'
  | 'saved-comments'
  | 'saved-posts'
  | 'hidden-posts'
  | 'settings'
  | 'statistics'

type MenuItem = {
  id: ReaderMenuItemId
  label: string
  description?: string
}

type MenuGroup = {
  label: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Посты',
    items: [
      { id: 'posts', label: 'Мои', description: 'Собственные посты' },
      {
        id: 'post-votes',
        label: 'Оценённые',
        description: 'Оценённые посты: нравится/не нравится',
      },
      {
        id: 'saved-posts',
        label: 'Сохранённые',
        description: 'Посты, которые вы сохранили',
      },
      { id: 'hidden-posts', label: 'Скрытые', description: 'Скрытые посты' },
    ],
  },
  {
    label: 'Комментарии',
    items: [
      { id: 'comments', label: 'Мои', description: 'Собственные комментарии' },
      {
        id: 'comment-votes',
        label: 'Оценённые',
        description: 'Оценённые комментарии: нравится/не нравится',
      },
      {
        id: 'saved-comments',
        label: 'Сохранённые',
        description: 'Комментарии, которые вы сохранили',
      },
    ],
  },
  {
    label: 'Аккаунт',
    items: [
      { id: 'settings', label: 'Настройки' },
      { id: 'statistics', label: 'Статистика' },
    ],
  },
  {
    label: 'Другое',
    items: [{ id: 'messages', label: 'Сообщения' }],
  },
]

type ReaderMenuProps = {
  activeMenuItem: ReaderMenuItemId | null
  availableMenuItems: ReaderMenuItemId[]
  disabled: boolean
  onSelect: (id: ReaderMenuItemId) => void
}

export default function ReaderMenu({
  activeMenuItem,
  availableMenuItems,
  disabled,
  onSelect,
}: ReaderMenuProps) {
  function renderMenuItem({ id, label, description }: MenuItem) {
    return (
      <li key={id}>
        <button
          className={styles.menuButton}
          type="button"
          title={description ?? label}
          aria-label={description}
          aria-current={activeMenuItem === id ? true : undefined}
          disabled={disabled || !availableMenuItems.includes(id)}
          onClick={() => onSelect(id)}
        >
          {label}
        </button>
      </li>
    )
  }

  return (
    <nav aria-label="Разделы архива">
      <ul className={styles.menu}>
        {menuGroups.map(({ label, items }, index) => {
          const orderedItems = [
            ...items.filter(({ id }) => availableMenuItems.includes(id)),
            ...items.filter(({ id }) => !availableMenuItems.includes(id)),
          ]

          return (
            <li key={label}>
              <details open={index === 0}>
                <summary className={styles.menuGroupTitle}>{label}</summary>
                <ul className={styles.menuItems}>
                  {orderedItems.map(renderMenuItem)}
                </ul>
              </details>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
