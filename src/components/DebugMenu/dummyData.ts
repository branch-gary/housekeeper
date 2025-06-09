import type { RecurrenceData } from '../../types/recurrence'

const STORAGE_KEY = 'housekeeper_tasks'
const CATEGORIES_KEY = 'housekeeper_categories'

interface Task {
  id: string;
  name: string;
  category: string;
  recurrence: RecurrenceData;
  createdAt: string;
  nextDueDate: string | null;
  isCompleted: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const sampleCategories: Category[] = [
  { id: 'cat1', name: 'Work', color: '#4A90E2' },
  { id: 'cat2', name: 'Personal', color: '#50E3C2' },
  { id: 'cat3', name: 'Shopping', color: '#F5A623' },
  { id: 'cat4', name: 'Health', color: '#D0021B' },
  { id: 'cat5', name: 'Home', color: '#7ED321' },
]

const today = new Date()
today.setHours(0, 0, 0, 0)

const sampleTasks: Task[] = [
  {
    id: 'task1',
    name: 'Complete project presentation',
    category: 'cat1',
    recurrence: {
      type: 'daily',
      interval: 1,
      startDate: today.toISOString()
    },
    nextDueDate: today.toISOString(),
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task2',
    name: 'Schedule dentist appointment',
    category: 'cat4',
    recurrence: {
      type: 'weekly',
      interval: 1,
      startDate: today.toISOString()
    },
    nextDueDate: today.toISOString(),
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task3',
    name: 'Buy groceries',
    category: 'cat3',
    recurrence: {
      type: 'daily',
      interval: 2,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    nextDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task4',
    name: 'Clean garage',
    category: 'cat5',
    recurrence: {
      type: 'weekly',
      interval: 2,
      startDate: today.toISOString()
    },
    nextDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task5',
    name: 'Update resume',
    category: 'cat2',
    recurrence: {
      type: 'monthly-date',
      interval: 1,
      monthDay: 15,
      startDate: today.toISOString()
    },
    nextDueDate: today.toISOString(),
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
]

export function generateDummyData() {
  // Store categories
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(sampleCategories))
  
  // Store tasks
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks))
  
  // Force a page reload to refresh the task store
  window.location.reload()
} 