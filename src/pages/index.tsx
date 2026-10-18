import { Head } from 'minista/head'

import '../styles/global.css'
import styles from './index.module.css'

export default function HomePage() {
  return (
    <>
      <Head htmlAttributes={{ lang: 'ru' }}>
        <title>reddit-exdata-viewer</title>
        <meta
          name="description"
          content="Тестовая страница локального просмотрщика выгрузки Reddit"
        />
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.container}>
            <strong>reddit-exdata-viewer</strong>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Тестовая страница</h1>
            <p className={styles.description}>Основная область</p>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.container}>Подвал</div>
        </footer>
      </div>
    </>
  )
}
