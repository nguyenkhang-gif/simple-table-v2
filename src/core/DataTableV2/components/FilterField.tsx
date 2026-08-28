import { assertNever, cn } from '@/lib/utils'
import type { FilterFieldDecl } from '../types'
import { DebouncedInput } from './DebouncedInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface FilterFieldProps {
  field: FilterFieldDecl
  value: unknown
  onChange: (value: unknown) => void
}

interface ControlProps extends FilterFieldProps {
  /** Nối với <label htmlFor> để bấm nhãn là focus vào ô */
  id: string
}

/** Sentinel cho lựa chọn "Tất cả" — Radix Select không nhận value rỗng */
const ALL_VALUE = '__all__'

const DEFAULT_WIDTH = 'w-48'

function TextFilter({ field, value, onChange, id }: ControlProps) {
  return (
    <DebouncedInput
      id={id}
      value={(value as string) ?? ''}
      onChange={(v) => onChange(v || undefined)}
      placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}...`}
      className="h-8 w-full"
    />
  )
}

function SelectFilter({ field, value, onChange, id }: ControlProps) {
  return (
    <Select
      value={(value as string) ?? ALL_VALUE}
      onValueChange={(v) => onChange(v === ALL_VALUE ? undefined : v)}
    >
      <SelectTrigger id={id} size="default" className="w-full">
        <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>All</SelectItem>
        {field.options?.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function CustomFilter({ field, value, onChange }: ControlProps) {
  return <>{field.render?.({ value, onChange })}</>
}

/**
 * Bọc nhãn + bề rộng cho mọi variant, rồi điều phối theo `variant`.
 * Bề rộng do wrapper quyết định (`field.width`), control bên trong luôn `w-full`
 * — chỉ một nơi kiểm soát kích thước.
 *
 * Mỗi nhánh là một COMPONENT thật, không phải hàm trả JSX bị gọi trực tiếp —
 * nhờ vậy renderer dùng được hook (`multi-select` cần state đóng/mở, `date-range`
 * cần state lịch...). Nếu gọi như hàm thường, hook sẽ bị tính vào `FilterBar`,
 * mà số field ở đó thay đổi theo cascading `hidden` → số hook đổi giữa các lần
 * render → crash (§8.1).
 *
 * Thêm variant: khai trong union `FilterVariant` rồi thêm `case` ở đây.
 * Quên `case` là lỗi biên dịch ngay tại `assertNever`.
 */
export function FilterField({ field, value, onChange }: FilterFieldProps) {
  const id = `filter-${field.key}`
  const controlProps: ControlProps = { field, value, onChange, id }

  return (
    <div className={cn('flex flex-col gap-1', field.width ?? DEFAULT_WIDTH)}>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {field.label}
      </label>
      {renderControl(controlProps)}
    </div>
  )
}

function renderControl(props: ControlProps) {
  switch (props.field.variant) {
    case 'text':
      return <TextFilter {...props} />
    case 'select':
      return <SelectFilter {...props} />
    case 'component':
      return <CustomFilter {...props} />
    default:
      return assertNever(props.field.variant, 'filter variant')
  }
}
