import { Head } from 'minista/head'

import { dictionaries, type Locale } from '../i18n'
import themeSetup from '../scripts/theme-setup.js?raw'
import ArchiveReader from './ArchiveReader'
import '../styles/global.css'
import styles from '../pages/index.module.css'

const siteUrl = 'https://ahmetshalee.github.io/reddit-exdata-viewer/'

export default function LocalizedPage({ locale }: { locale: Locale }) {
  const text = dictionaries[locale]
  const pageUrl = siteUrl + (locale === 'en' ? 'en/' : '')

  return (
    <>
      <Head htmlAttributes={{ lang: locale, 'data-theme': 'light' }}>
        <script dangerouslySetInnerHTML={{ __html: themeSetup }} />
        <title>{text.pageTitle}</title>
        <meta name="description" content={text.description} />
        <link rel="canonical" href={pageUrl} />
        <link rel="alternate" hrefLang="ru" href={siteUrl} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}en/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Reddit Exdata Viewer" />
        <meta property="og:title" content={text.pageTitle} />
        <meta property="og:description" content={text.description} />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:locale"
          content={locale === 'ru' ? 'ru_RU' : 'en_US'}
        />
      </Head>

      <header className={styles.banner} />

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
