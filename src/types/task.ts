import type { RecurrenceData } from './recurrence'

export interface Task {
  id: string
  name: string
  category: string
  recurrence: RecurrenceData
  createdAt: Date
  nextDueDate: Date | null
  isCompleted: boolean
}

export interface TasksByDate {
  [date: string]: Task[]
}

export interface CreateTaskData {
  name: string
  category: string
  recurrence: RecurrenceData
} 