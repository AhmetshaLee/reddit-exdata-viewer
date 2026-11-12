import type { ru } from './ru'

export type Messages = typeof ru

export function getVoteLabel(direction: string, text: Messages): string {
  return Object.hasOwn(text.votes, direction)
    ? text.votes[direction as keyof Messages['votes']]
    : direction
}
