import { en } from './en'
import { ru } from './ru'

export type Messages = typeof ru
export type Locale = 'ru' | 'en'

export const dictionaries = { ru, en }

export function localePath(locale: Locale) {
  return import.meta.env.BASE_URL + (locale === 'en' ? 'en/' : '')
}

export function getVoteLabel(direction: string, text: Messages): string {
  return Object.hasOwn(text.votes, direction)
    ? text.votes[direction as keyof Messages['votes']]
    : direction
}
