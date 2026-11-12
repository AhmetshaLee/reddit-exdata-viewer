import { Head } from 'minista/head'

import ArchiveReader from '../components/ArchiveReader'
import { ru as text } from '../i18n/ru'
import '../styles/global.css'
import styles from './index.module.css'

export default function HomePage() {
  return (
    <>
      <Head htmlAttributes={{ lang: 'ru' }}>
        <title>reddit-exdata-viewer</title>
        <meta name="description" content={text.description} />
      </Head>

      <header className={styles.banner}>
        <span className={styles.bannerPlaceholder}>{text.banner}</span>
      </header>

      <ArchiveReader client:load />

      <footer className={styles.footer}>
        <div className={styles.container}>
          <strong>reddit-exdata-viewer</strong>
          <span className={styles.footerDivider} aria-hidden="true">
            ·
          </span>
          {text.footer}
          <p className={styles.footerNote}>{text.footerNote}</p>
        </div>
      </footer>
    </>
  )
}
