import { assertNever, cn, isEmptyValue } from '@/lib/utils'
import { COL_SPAN } from '@/lib/grid'
import {
  EMPTY_DISPLAY,
  formatBoolean,
  formatCurrency,
  formatDate,
  formatText,
} from '../formatters'
import type { ViewFieldDecl } from '../types'

export interface ViewFieldProps<T> {
  field: ViewFieldDecl<T>
  record: T
}

interface ValueProps<T> extends ViewFieldProps<T> {
  value: unknown
}

function BadgeValue<T>({ field, value }: ValueProps<T>) {
  const color = field.badgeColors?.[String(value)]

  return (
    <span
      className={cn(
        'inline-block rounded-full px-2 py-0.5 text-xs',
        color ?? 'bg-muted text-muted-foreground',
      )}
    >
      {formatText(value)}
    </span>
  )
}

function CustomValue<T>({ field, record, value }: ValueProps<T>) {
  return <>{field.render?.({ value, record })}</>
}

/** Chọn cách hiển thị theo `format`. Giá trị rỗng đã được chặn từ trước. */
function renderValue<T>(props: ValueProps<T>) {
  const format = props.field.format ?? 'text'

  switch (format) {
    case 'text':
      return formatText(props.value)
    case 'currency':
      return formatCurrency(props.value)
    case 'date':
      return formatDate(props.value)
    case 'boolean':
      return formatBoolean(props.value)
    case 'badge':
      return <BadgeValue {...props} />
    case 'component':
      return <CustomValue {...props} />
    default:
      return assertNever(format, 'view format')
  }
}

export function ViewField<T>({ field, record }: ViewFieldProps<T>) {
  const value = record[field.name]

  /**
   * Ô rỗng xử lý một lần ở đây, trước khi rẽ nhánh format — nhờ vậy từng
   * formatter không phải tự lo, và mọi ô rỗng trông giống nhau.
   * Trừ `component`: field tự vẽ thì tự quyết định hiển thị gì khi rỗng.
   */
  const isEmpty = field.format !== 'component' && isEmptyValue(value)

  return (
    <div className={cn('flex flex-col gap-1', COL_SPAN[field.colSpan ?? 1])}>
      <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
      <div className="text-sm">
        {isEmpty ? (
          <span className="text-muted-foreground">{EMPTY_DISPLAY}</span>
        ) : (
          renderValue({ field, record, value })
        )}
      </div>
    </div>
  )
}
