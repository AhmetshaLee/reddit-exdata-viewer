import { Head } from 'minista/head'

import { dictionaries, type Locale } from '../i18n'
import ArchiveReader from './ArchiveReader'
import '../styles/global.css'
import styles from '../pages/index.module.css'

export default function LocalizedPage({ locale }: { locale: Locale }) {
  const text = dictionaries[locale]

  return (
    <>
      <Head htmlAttributes={{ lang: locale }}>
        <title>reddit-exdata-viewer</title>
        <meta name="description" content={text.description} />
      </Head>

      <header className={styles.banner}>
        <span className={styles.bannerPlaceholder}>{text.banner}</span>
      </header>

      <ArchiveReader locale={locale} client:load />

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
