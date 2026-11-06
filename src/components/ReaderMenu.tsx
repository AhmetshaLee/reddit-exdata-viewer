import styles from '../pages/index.module.css'

export type ReaderMenuItemId =
  | 'posts'
  | 'comments'
  | 'messages'
  | 'post-votes'
  | 'comment-votes'
  | 'saved-posts'
  | 'hidden-posts'
  | 'account'
  | 'settings'
  | 'statistics'

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
    label: 'Оценён. посты',
    description: 'Оценённые посты: нравится/не нравится',
  },
  {
    id: 'saved-posts',
    label: 'Сохр. посты',
    description: 'Посты, которые вы сохранили',
  },
  {
    id: 'comment-votes',
    label: 'Оценён. комм.',
    description: 'Оценённые комментарии: нравится/не нравится',
  },
  { id: 'hidden-posts', label: 'Скрытые посты' },
  { id: 'account', label: 'Аккаунт' },
  { id: 'settings', label: 'Настройки' },
  { id: 'statistics', label: 'Статистика' },
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
              title={description ?? label}
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
