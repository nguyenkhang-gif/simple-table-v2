import { Accordion } from '@/components/ui/accordion'
import { ViewSection } from './components/ViewSection'
import type { ViewV2Props } from './types'

/**
 * Container chỉ đọc, khai báo theo section.
 *
 * Chỉ render nội dung — `Sheet`/`Dialog` và footer hành động do màn hình tự bọc.
 * Khác `FormV2` (phải bày `formId`/`hideFooter` để nút submit ngoài `<form>` vẫn
 * kích hoạt được form), ở đây không có gì để submit nên không cần cơ chế nào.
 */
export function ViewV2<T>({ sections, record }: ViewV2Props<T>) {
  const defaultOpen = sections.filter((s) => s.defaultOpen !== false).map((s) => s.key)

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-3">
      {sections.map((section) => (
        <ViewSection key={section.key} section={section} record={record} />
      ))}
    </Accordion>
  )
}
