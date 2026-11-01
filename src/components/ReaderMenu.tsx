import styles from '../pages/index.module.css'

export type ReaderMenuItemId =
  | 'posts'
  | 'comments'
  | 'messages'
  | 'post-votes'
  | 'saved'
  | 'hidden'
  | 'account'
  | 'settings'

type MenuItem = {
  id: ReaderMenuItemId
  label: string
  description?: string
}

const menuItems: MenuItem[] = [
  { id: 'posts', label: 'Посты' },
  { id: 'comments', label: 'Комментарии' },
  { id: 'messages', label: 'Сообщения' },
  {
    id: 'post-votes',
    label: 'Оценки',
    description: 'Оценки: нравится и не нравится',
  },
  { id: 'saved', label: 'Сохранённое' },
  { id: 'hidden', label: 'Скрытые посты' },
  { id: 'account', label: 'Аккаунт' },
  { id: 'settings', label: 'Настройки' },
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
  return (
    <nav aria-label="Разделы архива">
      <ul className={styles.menu}>
        {menuItems.map(({ id, label, description }) => (
          <li key={id}>
            <button
              className={styles.menuButton}
              type="button"
              aria-label={description}
              aria-current={activeMenuItem === id ? true : undefined}
              disabled={disabled || !availableMenuItems.includes(id)}
              onClick={() => onSelect(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
