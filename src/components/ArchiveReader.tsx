import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import {
  readRedditSource,
  type RedditFileData,
} from '../lib/read-reddit-source'
import layout from '../pages/index.module.css'
import FileUploadView from './FileUploadView'
import PostVotesView from './PostVotesView'
import PreferencesView from './PreferencesView'
import ReaderMenu from './ReaderMenu'

type OpenedSource = {
  sourceId: number
  fileName: string
  files: RedditFileData[]
}

export default function ArchiveReader() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState<OpenedSource | null>(null)
  const [activeType, setActiveType] =
    useState<RedditFileData['type']>('post-votes')
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState('')

  const activeFile = opened?.files.find((file) => file.type === activeType)
  const availableTypes = opened?.files.map((file) => file.type) ?? []

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
      const firstFile =
        files.find((file) => file.type === 'post-votes') ?? files[0]
      setOpened((previous) => ({
        sourceId: (previous?.sourceId ?? 0) + 1,
        fileName: file.name,
        files,
      }))
      setActiveType(firstFile.type)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Не удалось открыть файл.',
      )
    } finally {
      setIsReading(false)
    }
  }

  function changeFile(type: RedditFileData['type']) {
    if (isReading || type === activeType) return
    if (!availableTypes.includes(type)) return

    setActiveType(type)
  }

  const chooseFile = () => fileInput.current?.click()

  const menu = (
    <ReaderMenu
      availableTypes={availableTypes}
      activeType={activeType}
      isReading={isReading}
      onFileChange={changeFile}
    />
  )
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
    if (!opened || !activeFile) {
      return (
        <FileUploadView
          menu={menu}
          feedback={feedback}
          isReading={isReading}
          onChooseFile={chooseFile}
        />
      )
    }

    switch (activeFile.type) {
      case 'post-votes':
        return (
          <PostVotesView
            key={opened.sourceId}
            votes={activeFile.records}
            fileName={opened.fileName}
            menu={menu}
            feedback={feedback}
            isReading={isReading}
            onChooseFile={chooseFile}
          />
        )
      case 'user-preferences':
        return (
          <PreferencesView
            key={opened.sourceId}
            records={activeFile.records}
            menu={menu}
            feedback={feedback}
          />
        )
    }
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
