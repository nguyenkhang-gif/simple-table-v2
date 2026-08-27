import { isEqual } from 'lodash'
import { X } from 'lucide-react'
import type { FilterFieldDecl } from '../types'
import { FilterField } from './FilterField'
import { Button } from '@/components/ui/button'

export interface FilterBarProps {
  filters?: FilterFieldDecl[]
  filterValues: Record<string, unknown>
  initialFilterValues: Record<string, unknown>
  onFilterChange: (key: string, value: unknown) => void
  onClear: () => void
}

export function FilterBar({
  filters,
  filterValues,
  initialFilterValues,
  onFilterChange,
  onClear,
}: FilterBarProps) {
  if (!filters || filters.length === 0) return null

  // Cascading — field tự khai điều kiện ẩn theo giá trị của field khác
  const visibleFields = filters.filter((field) => !field.hidden?.(filterValues))
  if (visibleFields.length === 0) return null

  const isDirty = !isEqual(filterValues, initialFilterValues)

  return (
    <div className="mb-3 flex flex-wrap items-end gap-2">
      {visibleFields.map((field) => (
        <FilterField
          key={field.key}
          field={field}
          value={filterValues[field.key]}
          onChange={(value) => onFilterChange(field.key, value)}
        />
      ))}

      {isDirty && (
        <Button variant="destructive" onClick={onClear}>
          <X />
          Clear filters
        </Button>
      )}
    </div>
  )
}
