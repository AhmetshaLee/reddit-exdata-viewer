import type { Messages } from '../i18n'

export class ReaderError extends Error {
  constructor(
    readonly code: keyof Messages['errors'],
    readonly details: string[] = [],
    options?: ErrorOptions,
  ) {
    super(code, options)
  }
}

export function formatReaderError(error: unknown, text: Messages): string {
  if (!(error instanceof ReaderError)) return text.errors.unexpected()

  if (error.code === 'fileContext') {
    return text.errors.fileContext([
      error.details[0],
      formatReaderError(error.cause, text),
    ])
  }

  return text.errors[error.code](error.details)
}
