export type PropertyEntry = { label: string; value: string }

export function filterProperties(
  records: PropertyEntry[],
  query: string,
): PropertyEntry[] {
  const search = query.trim().toLowerCase()
  return records.filter((record) =>
    `${record.label} ${record.value}`.toLowerCase().includes(search),
  )
}
