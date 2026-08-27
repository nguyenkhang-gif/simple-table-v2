import express from 'express'
import cors from 'cors'
import { queryList } from './mockQuery'
import { expensesStore, type Expense } from './expensesStore'

const app = express()
app.use(cors())
app.use(express.json())

// Giả lập độ trễ mạng thật
app.use((_req, _res, next) => setTimeout(next, 400))

app.get('/api/expenses', (req, res) => {
  const result = queryList(expensesStore, req.query, {
    filters: {
      category: (item, value) => item.category === value,
      note: (item, value) =>
        item.note.toLowerCase().includes(String(value).toLowerCase()),
    },
    sorters: {
      date: (a, b) => a.date.localeCompare(b.date),
    },
  })
  res.json(result)
})

app.post('/api/expenses', (req, res) => {
  const { category, amount, note, date } = req.body as Omit<Expense, 'id'>
  const created: Expense = { id: `exp_${Date.now()}`, category, amount, note, date }
  expensesStore.unshift(created)
  res.status(201).json(created)
})

app.put('/api/expenses/:id', (req, res) => {
  const index = expensesStore.findIndex((e) => e.id === req.params.id)
  if (index === -1) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  const { category, amount, note, date } = req.body as Omit<Expense, 'id'>
  const updated: Expense = { id: req.params.id, category, amount, note, date }
  expensesStore[index] = updated
  res.json(updated)
})

app.delete('/api/expenses/:id', (req, res) => {
  const index = expensesStore.findIndex((e) => e.id === req.params.id)
  if (index === -1) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  expensesStore.splice(index, 1)
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Mock API server listening on http://localhost:${PORT}`)
})
