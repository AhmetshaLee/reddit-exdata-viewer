import type { ReactNode } from 'react'

import layout from '../pages/index.module.css'
import PostCard, { type PostCardData } from './PostCard'
import ReaderLayout from './ReaderLayout'
import ReaderPagination, {
  type ReaderPaginationProps,
} from './ReaderPagination'
import styles from './posts.module.css'

type PostListViewProps = {
  title: string
  listLabel: string
  emptyFileMessage: string
  items: { post: PostCardData; sourceIndex: number }[]
  totalRecords: number
  pagination: ReaderPaginationProps
  toolbar: ReactNode
  menu: ReactNode
  feedback: ReactNode
}

export default function PostListView({
  title,
  listLabel,
  emptyFileMessage,
  items,
  totalRecords,
  pagination,
  toolbar,
  menu,
  feedback,
}: PostListViewProps) {
  const start = (pagination.page - 1) * pagination.pageSize

  return (
    <ReaderLayout
      title={title}
      sidebar={
        <>
          {menu}
          {pagination.pageCount > 0 && <ReaderPagination {...pagination} />}
        </>
      }
    >
      {feedback}
      {totalRecords === 0 && (
        <p className={layout.message}>{emptyFileMessage}</p>
      )}
      {toolbar}
      <hr className={styles.listDivider} />
      {totalRecords > 0 && pagination.totalRecords === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            По выбранным условиям ничего не найдено
          </p>
          <div className={styles.emptyIllustration} aria-hidden="true" />
        </div>
      )}
      <ol className={styles.cards} aria-label={listLabel} start={start + 1}>
        {items.map(({ post, sourceIndex }) => (
          <PostCard key={sourceIndex} post={post} />
        ))}
      </ol>
    </ReaderLayout>
  )
}
