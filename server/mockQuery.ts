export interface ListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ListResult<T> {
  data: T[]
  meta: ListMeta
}

export interface ListQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  [key: string]: unknown
}

export interface QueryConfig<T> {
  filters?: Record<string, (item: T, value: unknown) => boolean>
  sorters?: Record<string, (a: T, b: T) => number>
}

export function queryList<T>(db: T[], query: ListQuery, config: QueryConfig<T> = {}): ListResult<T> {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const { sortBy, sortDirection } = query
  const { filters = {}, sorters = {} } = config

  let filtered = db
  for (const [key, predicate] of Object.entries(filters)) {
    const value = query[key]
    if (value === undefined || value === '') continue
    filtered = filtered.filter((item) => predicate(item, value))
  }

  if (sortBy && sorters[sortBy]) {
    const compare = sorters[sortBy]
    filtered = [...filtered].sort((a, b) =>
      sortDirection === 'desc' ? -compare(a, b) : compare(a, b),
    )
  }

  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)

  return {
    data,
    meta: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
  }
}
