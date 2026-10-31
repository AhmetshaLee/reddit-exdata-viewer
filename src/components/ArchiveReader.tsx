import { useEffect } from 'react'

import { useReader } from '../hooks/useReader'
import layout from '../pages/index.module.css'
import FileUploadView from './FileUploadView'
import PostListView from './PostListView'
import ReaderLayout from './ReaderLayout'
import ReaderMenu from './ReaderMenu'
import ReaderPagination from './ReaderPagination'
import styles from './posts.module.css'

export default function ArchiveReader() {
  const {
    content,
    pagination,
    activeMenuItem,
    availableMenuItems,
    selectMenuItem,
    openFile,
    hasSource,
    isReading,
    error,
  } = useReader()

  const menuHint = content
    ? 'Доступны данные из открытого файла'
    : 'Пункты меню станут доступны после открытия CSV или ZIP'

  const feedback = (
    <>
      {isReading && (
        <p className={styles.message} role="status">
          Чтение файла…
        </p>
      )}
      {error && (
        <p className={styles.message} role="alert">
          {error}
        </p>
      )}
    </>
  )

  function renderContent() {
    if (!content) {
      return (
        <>
          <FileUploadView disabled={isReading} onFileSelected={openFile} />
          {feedback}
        </>
      )
    }

    switch (activeMenuItem) {
      case 'post-votes':
      case 'saved':
        return (
          <>
            {feedback}
            <PostListView
              {...content}
              disabled={isReading}
              onFileSelected={openFile}
            />
          </>
        )
      default:
        return feedback
    }
  }

  useEffect(() => {
    if (!hasSource) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasSource])

  return (
    <ReaderLayout
      title={content ? content.title : 'Ваш архив Reddit'}
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
              activeMenuItem={activeMenuItem}
              availableMenuItems={availableMenuItems}
              disabled={isReading}
              onSelect={selectMenuItem}
            />
          </div>
          <p className={layout.menuHint}>{menuHint}</p>
        </>
      }
      pagination={pagination && <ReaderPagination {...pagination} />}
    >
      {renderContent()}
    </ReaderLayout>
  )
}
