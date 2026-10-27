import { useEffect, type ReactNode } from 'react'

import type { UserPreference } from '../lib/user-preferences'
import styles from '../pages/index.module.css'
import ReaderLayout from './ReaderLayout'

type PreferencesViewProps = {
  records: UserPreference[]
  menu: ReactNode
  feedback: ReactNode
}

export default function PreferencesView({
  records,
  menu,
  feedback,
}: PreferencesViewProps) {
  useEffect(() => {
    const url = window.location.pathname + window.location.search
    window.history.replaceState(window.history.state, '', url)
  }, [])

  return (
    <ReaderLayout title="Настройки" sidebar={menu}>
      {feedback}
      {records.length === 0 && (
        <p className={styles.message}>В файле нет настроек</p>
      )}
      <dl className={styles.preferences}>
        {records.map(({ preference, value }, index) => (
          <div className={styles.preference} key={index}>
            <dt>{preference}</dt>
            <dd className={styles.preferenceValue}>
              {value === '' ? '—' : value}
            </dd>
          </div>
        ))}
      </dl>
    </ReaderLayout>
  )
}
