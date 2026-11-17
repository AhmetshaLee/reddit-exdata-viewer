import type { ReactNode } from 'react'

import type { Messages } from '../i18n'
import styles from '../pages/index.module.css'

type ReaderLayoutProps = {
  text: Messages
  title: string
  children: ReactNode
  menu: ReactNode
  pagination?: ReactNode
}

export default function ReaderLayout({
  text,
  title,
  children,
  menu,
  pagination,
}: ReaderLayoutProps) {
  return (
    <div className={`${styles.container} ${styles.workspace}`}>
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        {children}
        <p className={styles.localNote}>{text.localNote}</p>
      </main>

      <aside className={styles.sidebar} aria-label={text.controls}>
        {menu}
        {pagination}
      </aside>
    </div>
  )
}
