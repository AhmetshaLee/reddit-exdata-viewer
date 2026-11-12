import type { Messages } from '../i18n'
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

type ReaderMenuProps = {
  text: Messages
  activeMenuItem: ReaderMenuItemId | null
  availableMenuItems: ReaderMenuItemId[]
  disabled: boolean
  onSelect: (id: ReaderMenuItemId) => void
}

export default function ReaderMenu({
  text,
  activeMenuItem,
  availableMenuItems,
  disabled,
  onSelect,
}: ReaderMenuProps) {
  const menuGroups: MenuGroup[] = [
    {
      label: text.posts,
      items: [
        { id: 'posts', label: text.mine, description: text.ownPosts },
        {
          id: 'post-votes',
          label: text.rated,
          description: text.ratedPostHint,
        },
        {
          id: 'saved-posts',
          label: text.saved,
          description: text.savedPostHint,
        },
        {
          id: 'hidden-posts',
          label: text.hidden,
          description: text.hiddenPosts,
        },
      ],
    },
    {
      label: text.comments,
      items: [
        { id: 'comments', label: text.mine, description: text.ownComments },
        {
          id: 'comment-votes',
          label: text.rated,
          description: text.ratedCommentHint,
        },
        {
          id: 'saved-comments',
          label: text.saved,
          description: text.savedCommentHint,
        },
      ],
    },
    {
      label: text.account,
      items: [
        { id: 'settings', label: text.settings },
        { id: 'statistics', label: text.statistics },
      ],
    },
    {
      label: text.other,
      items: [{ id: 'messages', label: text.messages }],
    },
  ]

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
    <nav aria-label={text.sections}>
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
