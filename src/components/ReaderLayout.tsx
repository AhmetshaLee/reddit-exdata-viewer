import type { ReactNode } from 'react'

import styles from '../pages/index.module.css'

type ReaderLayoutProps = {
  title: string
  children: ReactNode
  sidebar: ReactNode
}

export default function ReaderLayout({
  title,
  children,
  sidebar,
}: ReaderLayoutProps) {
  return (
    <div className={`${styles.container} ${styles.workspace}`}>
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        {children}
        <p className={styles.localNote}>Данные не покидают ваше устройство</p>
      </main>

      <aside className={styles.sidebar} aria-label="Панель управления">
        {sidebar}
      </aside>
    </div>
  )
}
