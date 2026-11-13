import { useEffect } from 'react'

import { useReader } from '../hooks/useReader'
import { dictionaries, type Locale } from '../i18n'
import { PAGE_SIZE } from '../lib/pagination'
import type { RedditFileData } from '../lib/read-reddit-source'
import { formatReaderError } from '../lib/reader-error'
import layout from '../pages/index.module.css'
import CommentListView from './CommentListView'
import FileUploadView from './FileUploadView'
import PostListView from './PostListView'
import PropertyListView from './PropertyListView'
import ReaderLayout from './ReaderLayout'
import ReaderMenu from './ReaderMenu'
import ReaderPagination from './ReaderPagination'
import styles from './reader-results.module.css'

export default function ArchiveReader({ locale }: { locale: Locale }) {
  const text = dictionaries[locale]
  const FILE_TITLES: Record<RedditFileData['type'], string> = {
    'post-votes': text.votedPosts,
    'comment-votes': text.votedComments,
    'saved-comments': text.savedComments,
    'saved-posts': text.savedPosts,
    'hidden-posts': text.hiddenPosts,
    'user-preferences': text.settingsTitle,
    statistics: text.statistics,
  }

  const { source, menu, content } = useReader()
  const { selection, list } = content
  const title = selection ? FILE_TITLES[selection.file.type] : text.archiveTitle
  const menuHint = source.hasSource ? text.menuHint : text.menuEmptyHint
  const fileProps = {
    text,
    fileName: source.fileName,
    disabled: source.isReading,
    onFileSelected: source.openFile,
  }

  function changeTheme() {
    const root = document.documentElement
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = nextTheme

    try {
      localStorage.setItem('reddit-exdata-viewer-theme', nextTheme)
    } catch (error) {
      console.warn('Не удалось сохранить выбранную тему.', error)
    }
  }

  function renderContent() {
    if (!source.hasSource) {
      return (
        <FileUploadView
          locale={locale}
          text={text}
          disabled={source.isReading}
          onFileSelected={source.openFile}
        />
      )
    }
    if (!list) return null

    switch (list.type) {
      case 'comment-votes':
      case 'saved-comments':
        return (
          <CommentListView
            {...list}
            {...fileProps}
            title={title}
            query={content.query}
            onQueryChange={content.changeQuery}
            onFiltersChange={content.changeFilters}
            onReset={content.resetConditions}
          />
        )
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
      text={text}
      title={title}
      menu={
        <>
          <div className={layout.sidebarPanel}>
            <div className={layout.themeControl}>
              <span>{text.theme}</span>
              <button
                className={layout.themeButton}
                type="button"
                aria-label={text.changeTheme}
                onClick={changeTheme}
              >
                <span className={layout.themeLight}>{text.light}</span>
                <span className={layout.themeDark}>{text.dark}</span>
              </button>
            </div>

            <hr className={layout.sidebarDivider} />

            <ReaderMenu
              text={text}
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
            text={text}
            disabled={source.isReading}
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
          {text.reading}
        </p>
      )}
      {source.error !== null && (
        <p className={styles.message} role="alert">
          {formatReaderError(source.error, text)}
        </p>
      )}
      {renderContent()}
    </ReaderLayout>
  )
}
