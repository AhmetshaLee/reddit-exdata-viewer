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
          content="Локальный просмотрщик личного архива Reddit"
        />
      </Head>

      <header className={styles.banner}>
        <span className={styles.bannerPlaceholder}>Место для баннера</span>
      </header>

      <div className={`${styles.container} ${styles.workspace}`}>
        <main className={styles.main}>
          <h1 className={styles.title}>Ваш архив Reddit</h1>
          <p className={styles.intro}>
            Откройте архив, чтобы просматривать свои данные в удобном виде
          </p>

          <section className={styles.dropZone} aria-labelledby="upload-title">
            <h2 className={styles.uploadTitle} id="upload-title">
              Перетащите архив сюда
            </h2>
            <p className={styles.uploadDescription}>
              или выберите файл на компьютере
            </p>
            <button className={styles.uploadButton} type="button">
              Выбрать архив
            </button>
          </section>

          <p className={styles.localNote}>Данные не покидают ваше устройство</p>
        </main>

        <aside className={styles.sidebar} aria-label="Панель управления">
          <div className={styles.sidebarPanel}>
            <div className={styles.themeControl}>
              <span>Тема страницы</span>
              <button
                className={styles.themeButton}
                type="button"
                aria-label="Сменить тему страницы"
                disabled
              >
                <span className={styles.themeLight}>С</span>
                <span className={styles.themeDark}>Т</span>
              </button>
            </div>

            <nav aria-label="Разделы архива">
              <ul className={styles.menu}>
                {[
                  'Посты',
                  'Комментарии',
                  'Сообщения',
                  'Голосования',
                  'Сохранённое',
                  'Аккаунт',
                  'Настройки',
                ].map((label) => (
                  <li key={label}>
                    <button
                      className={styles.menuButton}
                      type="button"
                      aria-label={
                        label === 'Голосования'
                          ? 'Голосования: апвоуты и даунвоуты'
                          : undefined
                      }
                      disabled
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className={styles.menuHint}>
            Разделы станут доступны после открытия архива
          </p>
        </aside>
      </div>

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
