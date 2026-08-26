export type ExpenseCategory = 'food' | 'transport' | 'shopping' | 'bills' | 'entertainment'

export interface Expense {
  id: string
  category: ExpenseCategory
  amount: number
  note: string
  date: string
}

const CATEGORIES: ExpenseCategory[] = ['food', 'transport', 'shopping', 'bills', 'entertainment']

const NOTES: Record<ExpenseCategory, string[]> = {
  food: ['Bún bò', 'Cà phê', 'Ăn trưa văn phòng', 'Trà sữa'],
  transport: ['Đổ xăng', 'Grab', 'Vé xe bus'],
  shopping: ['Quần áo', 'Đồ điện tử', 'Sách'],
  bills: ['Tiền điện', 'Tiền nước', 'Internet'],
  entertainment: ['Xem phim', 'Game', 'Spotify'],
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDateWithinDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * days))
  return date.toISOString().slice(0, 10)
}

const MOCK_TOTAL = 137

export const expensesStore: Expense[] = Array.from({ length: MOCK_TOTAL }, (_, i) => {
  const category = randomItem(CATEGORIES)
  return {
    id: `exp_${i}`,
    category,
    amount: Math.floor(Math.random() * 2_000_000) + 10_000,
    note: randomItem(NOTES[category]),
    date: randomDateWithinDays(60),
  }
})
