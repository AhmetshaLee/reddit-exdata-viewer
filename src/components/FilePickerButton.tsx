import { useRef, type ChangeEvent, type ReactNode } from 'react'

type FilePickerButtonProps = {
  children: ReactNode
  className: string
  disabled: boolean
  onFileSelected: (file: File) => void
}

export default function FilePickerButton({
  children,
  className,
  disabled,
  onFileSelected,
}: FilePickerButtonProps) {
  const input = useRef<HTMLInputElement>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (file) onFileSelected(file)
  }

  return (
    <>
      <input
        ref={input}
        type="file"
        accept=".csv,.zip,text/csv,application/zip,application/x-zip-compressed"
        hidden
        disabled={disabled}
        onChange={handleChange}
      />
      <button
        className={className}
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
      >
        {children}
      </button>
    </>
  )
}
