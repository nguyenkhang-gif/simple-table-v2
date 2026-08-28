import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { CalendarIcon, Check } from 'lucide-react'
import { cn, isEmptyValue } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DATE_PRESETS,
  PRESET_LABELS,
  formatRangeLabel,
  fromISODate,
  resolvePreset,
  toISODate,
} from '../dateRange'
import type { DatePreset, DateRangeValue } from '../types'

export interface DateRangeFilterProps {
  id: string
  value: DateRangeValue | undefined
  onChange: (value: DateRangeValue | undefined) => void
  presets?: DatePreset[]
}

/**
 * Preset dựng sẵn + chọn tay trên lịch, trong cùng một popover.
 *
 * Không debounce: khác ô text gõ từng ký tự, mỗi thao tác ở đây là một lựa chọn
 * dứt khoát nên bắn request ngay là đúng.
 */
export function DateRangeFilter({ id, value, onChange, presets }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  const visiblePresets = presets ?? DATE_PRESETS

  const selected: DateRange | undefined = value?.from
    ? { from: fromISODate(value.from), to: fromISODate(value.to) }
    : undefined

  function pickPreset(preset: DatePreset) {
    onChange(resolvePreset(preset))
    setOpen(false)
  }

  function pickRange(range: DateRange | undefined) {
    // Chọn tay thì không còn là preset nào nữa — bỏ `preset` để nhãn hiện ngày
    const next: DateRangeValue = {
      from: range?.from && toISODate(range.from),
      to: range?.to && toISODate(range.to),
    }
    onChange(isEmptyValue(next) ? undefined : next)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'h-8 w-full justify-start font-normal',
            !value?.from && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="size-4" />
          {formatRangeLabel(value)}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col gap-1 border-b p-1">
          {visiblePresets.map((preset) => (
            <Button
              key={preset}
              variant="ghost"
              size="sm"
              className="justify-start font-normal"
              onClick={() => pickPreset(preset)}
            >
              <Check
                className={cn('size-4', value?.preset !== preset && 'invisible')}
              />
              {PRESET_LABELS[preset]}
            </Button>
          ))}
        </div>

        <Calendar mode="range" selected={selected} onSelect={pickRange} autoFocus />

        <div className="flex justify-end border-t p-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!value?.from && !value?.to}
            onClick={() => {
              onChange(undefined)
              setOpen(false)
            }}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
