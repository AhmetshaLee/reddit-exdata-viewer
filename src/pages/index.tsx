import { Head } from 'minista/head'

import PostVotesReader from '../components/PostVotesReader'
import '../styles/global.css'
import styles from './index.module.css'

export default function HomePage() {
  return (
    <>
      <Head htmlAttributes={{ lang: 'ru' }}>
        <title>reddit-exdata-viewer</title>
        <meta
          name="description"
          content="Локальный просмотрщик личного архива Reddit"
        />
      </Head>

      <header className={styles.banner}>
        <span className={styles.bannerPlaceholder}>Место для баннера</span>
      </header>

      <PostVotesReader client:load />

      <footer className={styles.footer}>
        <div className={styles.container}>
          <strong>reddit-exdata-viewer</strong>
          <span className={styles.footerDivider} aria-hidden="true">
            ·
          </span>
          Локальный просмотрщик данных Reddit
          <p className={styles.footerNote}>
            exdata [exported data] — экспортированные данные
          </p>
        </div>
      </footer>
    </>
  )
}
