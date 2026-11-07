export type FilterChoice = { value: string; label: string; count: number }

export function getVoteChoices(
  directions: (string | undefined)[],
): FilterChoice[] {
  let upCount = 0
  let downCount = 0
  for (const direction of directions) {
    if (direction === 'up') upCount += 1
    else if (direction === 'down') downCount += 1
  }
  return [
    { value: 'all', label: 'Все', count: directions.length },
    { value: 'up', label: 'Нравится', count: upCount },
    { value: 'down', label: 'Не нравится', count: downCount },
  ]
}

export function getCommunityChoices(
  records: { community: string; communityLabel: string }[],
): FilterChoice[] {
  const communities = new Map<string, FilterChoice>()
  for (const { community, communityLabel } of records) {
    const choice = communities.get(community)
    if (choice) {
      choice.count += 1
    } else {
      communities.set(community, {
        value: community,
        label: communityLabel,
        count: 1,
      })
    }
  }
  const choices = [...communities.values()].sort((first, second) => {
    const difference = second.count - first.count
    if (difference !== 0) return difference
    return first.label.localeCompare(second.label, 'en', {
      sensitivity: 'base',
    })
  })
  return [{ value: 'all', label: 'Все', count: records.length }, ...choices]
}
