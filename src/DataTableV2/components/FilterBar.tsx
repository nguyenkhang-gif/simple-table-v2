import type { ColumnDef } from '../types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface FilterBarProps<T> {
  columns: ColumnDef<T>[]
  filterValues: Record<string, unknown>
  onFilterChange: (key: string, value: unknown) => void
}

const ALL_VALUE = '__all__'

export function FilterBar<T>({ columns, filterValues, onFilterChange }: FilterBarProps<T>) {
  const filterableColumns = columns.filter((col) => col.filterable)
  if (filterableColumns.length === 0) return null

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {filterableColumns.map((col) => {
        const value = filterValues[col.key]

        if (col.filterVariant === 'select') {
          return (
            <Select
              key={col.key}
              value={(value as string) ?? ALL_VALUE}
              onValueChange={(v) => onFilterChange(col.key, v === ALL_VALUE ? undefined : v)}
            >
              <SelectTrigger size="default" className="w-40">
                <SelectValue placeholder={col.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>{col.label} — Tất cả</SelectItem>
                {col.filterOptions?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        return (
          <Input
            key={col.key}
            value={(value as string) ?? ''}
            onChange={(e) => onFilterChange(col.key, e.target.value || undefined)}
            placeholder={`Lọc ${col.label.toLowerCase()}...`}
            className="h-8 w-48"
          />
        )
      })}
    </div>
  )
}
