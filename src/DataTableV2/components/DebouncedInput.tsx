import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'

export interface DebouncedInputProps {
  value: string
  onChange: (value: string) => void
  id?: string
  placeholder?: string
  delay?: number
  className?: string
}

/**
 * Hai state tách biệt để ô input không bị giật:
 * - `local` đổi ngay mỗi keystroke  → chữ hiện tức thì
 * - `onChange` chỉ gọi sau `delay`  → query mới bắn
 */
export function DebouncedInput({
  value,
  onChange,
  id,
  placeholder,
  delay = 400,
  className,
}: DebouncedInputProps) {
  const [local, setLocal] = useState(value)

  // Giữ callback mới nhất trong ref để KHÔNG đưa `onChange` vào deps bên dưới.
  // `onChange` là arrow function tạo mới mỗi lần cha render — đưa vào deps thì
  // mỗi lần cha re-render (vd `isFetching` đổi) sẽ clear timer đang chờ, nuốt
  // mất keystroke của user.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })

  // Giá trị lần cuối chính ô này phát ra — để phân biệt "value đổi do mình"
  // với "value đổi từ ngoài" (vd bấm Xoá lọc)
  const lastEmitted = useRef(value)

  // Debounce: mỗi lần `local` đổi thì hẹn giờ lại từ đầu, cleanup huỷ giờ cũ
  useEffect(() => {
    if (local === lastEmitted.current) return

    const timer = setTimeout(() => {
      lastEmitted.current = local
      onChangeRef.current(local)
    }, delay)

    return () => clearTimeout(timer)
  }, [local, delay])

  // Chỉ đồng bộ khi value đổi từ ngoài — nếu sync vô điều kiện sẽ ghi đè chữ
  // user đang gõ dở mỗi lần debounce vừa bắn xong
  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value
      setLocal(value)
    }
  }, [value])

  return (
    <Input
      id={id}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  )
}
