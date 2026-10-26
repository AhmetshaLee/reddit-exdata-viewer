import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import {
  readRedditSource,
  type RedditFileData,
} from '../lib/read-reddit-source'
import layout from '../pages/index.module.css'
import FileUploadView from './FileUploadView'
import PostVotesView from './PostVotesView'
import ReaderMenu from './ReaderMenu'

type OpenedSource = {
  sourceId: number
  fileName: string
  files: RedditFileData[]
}

export default function ArchiveReader() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState<OpenedSource | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!opened) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [opened])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    setIsReading(true)
    setError('')
    try {
      const files = await readRedditSource(file)
      setOpened((previous) => ({
        sourceId: (previous?.sourceId ?? 0) + 1,
        fileName: file.name,
        files,
      }))
      clearPageHash()
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Не удалось открыть файл.',
      )
    } finally {
      setIsReading(false)
    }
  }

  function clearPageHash() {
    const url = window.location.pathname + window.location.search
    window.history.replaceState(window.history.state, '', url)
  }

  const chooseFile = () => fileInput.current?.click()

  const menu = <ReaderMenu hasFile={opened !== null} isReading={isReading} />
  const feedback = (
    <>
      {isReading && (
        <p className={layout.message} role="status">
          Чтение файла…
        </p>
      )}
      {error && (
        <p className={layout.message} role="alert">
          {error}
        </p>
      )}
    </>
  )

  function renderView() {
    if (!opened) {
      return (
        <FileUploadView
          menu={menu}
          feedback={feedback}
          isReading={isReading}
          onChooseFile={chooseFile}
        />
      )
    }

    return (
      <PostVotesView
        key={opened.sourceId}
        votes={opened.files[0].records}
        fileName={opened.fileName}
        menu={menu}
        feedback={feedback}
        isReading={isReading}
        onChooseFile={chooseFile}
      />
    )
  }

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept=".csv,.zip,text/csv,application/zip,application/x-zip-compressed"
        hidden
        disabled={isReading}
        onChange={handleFileChange}
      />
      {renderView()}
    </>
  )
}
