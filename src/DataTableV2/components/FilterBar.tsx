import { isEqual } from 'lodash'
import { X } from 'lucide-react'
import type { FilterFieldDecl } from '../types'
import { FilterField } from './FilterField'
import { isEmptyValue } from '../utils'
import { Button } from '@/components/ui/button'

/**
 * Bỏ các key có giá trị rỗng trước khi so sánh. Xoá sạch một ô để lại
 * `{ key: undefined }` chứ không xoá key, mà `isEqual({a: undefined}, {})` là
 * `false` — không lọc thì nút "Clear" không bao giờ tự ẩn.
 *
 * Dùng chung `isEmptyValue` với `buildQueryParams` để "đang lọc" đúng nghĩa là
 * "có param đang được gửi đi".
 */
function activeValues(values: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => !isEmptyValue(value)),
  )
}

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

  const isDirty = !isEqual(activeValues(filterValues), activeValues(initialFilterValues))

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
