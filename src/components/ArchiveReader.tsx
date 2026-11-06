import { useEffect } from 'react'

import { useReader } from '../hooks/useReader'
import { PAGE_SIZE } from '../lib/pagination'
import type { RedditFileData } from '../lib/read-reddit-source'
import layout from '../pages/index.module.css'
import FileUploadView from './FileUploadView'
import PostListView from './PostListView'
import PropertyListView from './PropertyListView'
import ReaderLayout from './ReaderLayout'
import ReaderMenu from './ReaderMenu'
import ReaderPagination from './ReaderPagination'
import styles from './reader-results.module.css'

const FILE_TITLES: Record<RedditFileData['type'], string> = {
  'post-votes': 'Оценённые посты',
  'saved-posts': 'Сохранённые посты',
  'hidden-posts': 'Скрытые посты',
  'user-preferences': 'Настройки Reddit',
  statistics: 'Статистика',
}

export default function ArchiveReader() {
  const { source, menu, content } = useReader()
  const { selection, list } = content
  const title = selection
    ? FILE_TITLES[selection.file.type]
    : 'Ваш архив Reddit'
  const menuHint = source.hasSource
    ? 'Доступны данные из открытого файла'
    : 'Пункты меню станут доступны после открытия CSV или ZIP'
  const fileProps = {
    fileName: source.fileName,
    disabled: source.isReading,
    onFileSelected: source.openFile,
  }

  function renderContent() {
    if (!source.hasSource) {
      return (
        <FileUploadView
          disabled={source.isReading}
          onFileSelected={source.openFile}
        />
      )
    }
    if (!list) return null

    switch (list.type) {
      case 'user-preferences':
      case 'statistics':
        return (
          <PropertyListView
            {...list}
            {...fileProps}
            query={content.query}
            onQueryChange={content.changeQuery}
            onReset={content.resetConditions}
          />
        )
      case 'post-votes':
      case 'saved-posts':
      case 'hidden-posts':
        return (
          <PostListView
            {...list}
            {...fileProps}
            title={title}
            query={content.query}
            onQueryChange={content.changeQuery}
            onFiltersChange={content.changeFilters}
            onReset={content.resetConditions}
          />
        )
    }
  }

  useEffect(() => {
    if (import.meta.env.DEV || !source.hasSource) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [source.hasSource])

  return (
    <ReaderLayout
      title={title}
      menu={
        <>
          <div className={layout.sidebarPanel}>
            <div className={layout.themeControl}>
              <span>Тема страницы</span>
              <button
                className={layout.themeButton}
                type="button"
                aria-label="Сменить тему страницы"
                disabled
              >
                <span className={layout.themeLight}>С</span>
                <span className={layout.themeDark}>Т</span>
              </button>
            </div>

            <hr className={layout.sidebarDivider} />

            <ReaderMenu
              activeMenuItem={menu.activeMenuItem}
              availableMenuItems={menu.availableMenuItems}
              disabled={source.isReading}
              onSelect={menu.selectMenuItem}
            />
          </div>
          <p className={layout.menuHint}>{menuHint}</p>
        </>
      }
      pagination={
        list &&
        'pageCount' in list &&
        list.pageCount > 0 && (
          <ReaderPagination
            page={list.page}
            pageCount={list.pageCount}
            totalRecords={list.matchedRecords}
            pageSize={PAGE_SIZE}
            onPageChange={content.changePage}
          />
        )
      }
    >
      {source.isReading && (
        <p className={styles.message} role="status">
          Чтение файла…
        </p>
      )}
      {source.error && (
        <p className={styles.message} role="alert">
          {source.error}
        </p>
      )}
      {renderContent()}
    </ReaderLayout>
  )
}
