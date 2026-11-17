import { dictionaries, localePath, type Locale } from '../i18n'
import styles from './language-switcher.module.css'

const languages = [
  { locale: 'ru', label: 'RU', name: 'Русский' },
  { locale: 'en', label: 'EN', name: 'English' },
] as const

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <nav className={styles.segments} aria-label={dictionaries[locale].language}>
      {languages.map((language) =>
        language.locale === locale ? (
          <span
            className={styles.option}
            key={language.locale}
            lang={language.locale}
            aria-label={language.name}
            aria-current="page"
          >
            {language.label}
          </span>
        ) : (
          <a
            className={styles.option}
            key={language.locale}
            href={localePath(language.locale)}
            lang={language.locale}
            hrefLang={language.locale}
            aria-label={language.name}
          >
            {language.label}
          </a>
        ),
      )}
    </nav>
  )
}
