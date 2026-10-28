import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getPageFromHash, PAGE_SIZE } from '../lib/pagination'
import {
  DEFAULT_FILTERS,
  filterPostVotes,
  getCommunityChoices,
  getVoteChoices,
  preparePostVotes,
  type PostVoteFilters,
} from '../lib/post-vote-filters'
import type { PostVote } from '../lib/post-votes'
import PostListView from './PostListView'
import ReaderToolbar from './ReaderToolbar'

type PostVotesViewProps = {
  votes: PostVote[]
  fileName: string
  menu: ReactNode
  feedback: ReactNode
  isReading: boolean
  onChooseFile: () => void
}

export default function PostVotesView({
  votes,
  fileName,
  menu,
  feedback,
  isReading,
  onChooseFile,
}: PostVotesViewProps) {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const records = useMemo(() => preparePostVotes(votes), [votes])
  const filteredRecords = useMemo(
    () => filterPostVotes(records, filters),
    [records, filters],
  )
  const voteChoices = useMemo(() => getVoteChoices(records), [records])
  const communityChoices = useMemo(
    () => getCommunityChoices(records),
    [records],
  )

  const pageCount = Math.ceil(filteredRecords.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageRecords = filteredRecords.slice(start, start + PAGE_SIZE)

  const updatePage = useCallback(
    (nextPage: number, addToHistory = false) => {
      setPage(nextPage)
      const url = records.length
        ? `#${nextPage}`
        : window.location.pathname + window.location.search
      if (addToHistory) {
        window.history.pushState(window.history.state, '', url)
      } else {
        window.history.replaceState(window.history.state, '', url)
      }
    },
    [records.length],
  )

  function changeFilters(nextFilters: PostVoteFilters) {
    setFilters(nextFilters)
    updatePage(1)
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return
    updatePage(nextPage, true)
  }

  useEffect(() => {
    updatePage(1)
  }, [updatePage])

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromHash(window.location.hash, pageCount)
      updatePage(nextPage)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [pageCount, updatePage])

  return (
    <PostListView
      title="Оценки"
      listLabel="Оценки постов"
      emptyFileMessage="В файле нет оценок"
      items={pageRecords.map(({ vote, sourceIndex }) => ({
        post: vote,
        sourceIndex,
      }))}
      totalRecords={records.length}
      pagination={{
        page,
        pageCount,
        totalRecords: filteredRecords.length,
        pageSize: PAGE_SIZE,
        onPageChange: changePage,
      }}
      toolbar={
        <ReaderToolbar
          onChooseFile={onChooseFile}
          disabled={isReading}
          fileName={fileName}
          query={filters.query}
          filterGroups={[
            {
              name: 'direction',
              legend: 'Оценки',
              choices: voteChoices,
              selected: filters.direction,
              onChange: (direction) => changeFilters({ ...filters, direction }),
            },
            {
              name: 'community',
              legend: 'Сабреддиты',
              choices: communityChoices,
              selected: filters.community,
              onChange: (community) => changeFilters({ ...filters, community }),
            },
          ]}
          totalRecords={records.length}
          matchedRecords={filteredRecords.length}
          onQueryChange={(query) => changeFilters({ ...filters, query })}
          onReset={() => changeFilters(DEFAULT_FILTERS)}
        />
      }
      menu={menu}
      feedback={feedback}
    />
  )
}
