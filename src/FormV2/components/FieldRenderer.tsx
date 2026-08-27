import { assertNever } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FormFieldDecl, FormValues } from '../types'

export interface FieldRendererProps {
  field: FormFieldDecl<FormValues>
  value: unknown
  onChange: (value: unknown) => void
  onBlur?: () => void
}

/**
 * Chỉ trả về CONTROL THÔ — label, dòng lỗi, aria do `FormItem`/`FormLabel`/
 * `FormMessage` lo. Mỗi variant là component thật (không phải hàm trả JSX) để
 * renderer dùng được hook, theo đúng khuôn `DataTableV2/components/FilterField`.
 */

function TextControl({ field, value, onChange, onBlur }: FieldRendererProps) {
  return (
    <Input
      type={field.variant === 'date' ? 'date' : 'text'}
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder}
    />
  )
}

function NumberControl({ field, value, onChange, onBlur }: FieldRendererProps) {
  return (
    <Input
      type="number"
      value={value === undefined || value === null ? '' : String(value)}
      // Ô rỗng phải là undefined chứ không phải NaN, để rule `required` bắt đúng
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      onBlur={onBlur}
      placeholder={field.placeholder}
    />
  )
}

function TextareaControl({ field, value, onChange, onBlur }: FieldRendererProps) {
  return (
    <Textarea
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder}
      rows={4}
    />
  )
}

function SelectControl({ field, value, onChange }: FieldRendererProps) {
  return (
    <Select value={(value as string) ?? ''} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function CustomControl({ field, value, onChange }: FieldRendererProps) {
  return <>{field.render?.({ value, onChange })}</>
}

export function FieldRenderer(props: FieldRendererProps) {
  switch (props.field.variant) {
    case 'text':
    case 'date':
      return <TextControl {...props} />
    case 'number':
      return <NumberControl {...props} />
    case 'textarea':
      return <TextareaControl {...props} />
    case 'select':
      return <SelectControl {...props} />
    case 'component':
      return <CustomControl {...props} />
    default:
      return assertNever(props.field.variant, 'form field variant')
  }
}
