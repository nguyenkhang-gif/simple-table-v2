import { cn } from '@/lib/utils'
import type { PaginationAlign, PaginationConfig } from '../types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface PaginationProps {
  page: number
  limit: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  config?: PaginationConfig
}

const ALIGN_CLASS: Record<PaginationAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const DEFAULT_PAGE_SIZES = [5, 10, 20, 50]

export function Pagination({
  page,
  limit,
  totalPages,
  total,
  onPageChange,
  onLimitChange,
  config,
}: PaginationProps) {
  const {
    align = 'center',
    pageSizeOptions = DEFAULT_PAGE_SIZES,
    showTotal = true,
  } = config ?? {}

  return (
    <div className={cn('mt-4 flex flex-wrap items-center gap-4 text-sm', ALIGN_CLASS[align])}>
      {pageSizeOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
            <SelectTrigger size="sm" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showTotal && (
        <span className="text-muted-foreground">
          Page {page}/{totalPages} — {total} records total
        </span>
      )}

      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  )
}
