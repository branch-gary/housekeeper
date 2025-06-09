import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react'
import type { Task, CreateTaskData } from '../types/task'
import { getNextDueDate } from '../utils/taskDate'

// Simple UUID generation that works in all browsers
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

interface Category {
  id: string
  name: string
  color: string
}

interface TaskContextType {
  tasks: Task[]
  addTask: (data: CreateTaskData) => void
  getTodayTasks: () => Task[]
  getUpcomingTasks: () => Task[]
  getTasksForCategory: (categoryId: string) => Task[]
  toggleTaskCompletion: (taskId: string) => void
  deleteTask: (taskId: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  getFilteredTasks: (tasks: Task[]) => Task[]
  categories: Category[]
  addCategory: (name: string) => Promise<{ success: boolean; error?: string }>
  deleteCategory: (id: string) => void
}

const TaskContext = createContext<TaskContextType | null>(null)

const STORAGE_KEY = 'housekeeper_tasks'
const CATEGORIES_KEY = 'housekeeper_categories'

// Default categories with consistent colors
const DEFAULT_CATEGORIES: Category[] = [
  { id: generateId(), name: 'Kitchen', color: '#4A90E2' },
  { id: generateId(), name: 'Living Room', color: '#9B59B6' },
  { id: generateId(), name: 'Bathroom', color: '#2ECC71' }
]

// Available colors for new categories
const CATEGORY_COLORS = [
  '#4A90E2', // Blue
  '#9B59B6', // Purple
  '#2ECC71', // Green
  '#E74C3C', // Red
  '#F1C40F', // Yellow
  '#E67E22', // Orange
  '#34495E', // Navy
  '#16A085', // Teal
  '#8E44AD', // Deep Purple
  '#D35400'  // Burnt Orange
]

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY)
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error)
      return []
    }
  })

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const savedCategories = localStorage.getItem(CATEGORIES_KEY)
      return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES
    } catch (error) {
      console.error('Error loading categories from localStorage:', error)
      return DEFAULT_CATEGORIES
    }
  })

  const [searchQuery, setSearchQuery] = useState('')

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error)
    }
  }, [tasks])

  // Save categories to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    } catch (error) {
      console.error('Error saving categories to localStorage:', error)
    }
  }, [categories])

  const addTask = useCallback((data: CreateTaskData) => {
    const newTask: Task = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      nextDueDate: getNextDueDate(data.recurrence),
      isCompleted: false
    }

    console.log('Adding task:', newTask)
    setTasks(prev => [...prev, newTask])
  }, [])

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    ))
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    console.log('Deleting task:', taskId)
    setTasks(prev => {
      const newTasks = prev.filter(task => task.id !== taskId)
      console.log('Tasks after deletion:', newTasks)
      return newTasks
    })
  }, [])

  // Filter tasks based on search query
  const getFilteredTasks = useCallback((tasksToFilter: Task[]): Task[] => {
    if (!searchQuery.trim()) return tasksToFilter

    const normalizedQuery = searchQuery.toLowerCase().trim()
    return tasksToFilter.filter(task => 
      task && // Check if task exists
      task.name && // Check if task has a name
      task.name.toLowerCase().includes(normalizedQuery)
    )
  }, [searchQuery])

  const getTasksForCategory = useCallback((categoryId: string): Task[] => {
    // First get all tasks for this category
    const categoryTasks = tasks.filter(task => task.category === categoryId)
    
    // Apply any active search filter
    return getFilteredTasks(categoryTasks)
  }, [tasks, getFilteredTasks])

  const getTodayTasks = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayTasks = tasks.filter(task => {
      if (!task.nextDueDate) return false
      try {
        const dueDate = new Date(task.nextDueDate)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate >= today && dueDate < tomorrow
      } catch (error) {
        console.error('Error processing task date:', error, task)
        return false
      }
    })

    return getFilteredTasks(todayTasks)
  }, [tasks, getFilteredTasks])

  const getUpcomingTasks = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's tasks for filtering
    const todaysTasks = getTodayTasks()
    const todayTaskIds = new Set(todaysTasks.map(task => task.id))

    const upcomingTasks = tasks
      .filter(task => {
        if (!task.nextDueDate) return false
        try {
          // Skip if this task is already in today's list
          if (todayTaskIds.has(task.id)) return false
          
          const dueDate = new Date(task.nextDueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate >= today
        } catch (error) {
          console.error('Error processing task date:', error, task)
          return false
        }
      })
      .sort((a, b) => {
        if (!a.nextDueDate || !b.nextDueDate) return 0
        try {
          return new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
        } catch (error) {
          console.error('Error comparing task dates:', error, { a, b })
          return 0
        }
      })

    return getFilteredTasks(upcomingTasks)
  }, [tasks, getTodayTasks, getFilteredTasks])

  const addCategory = useCallback(async (name: string): Promise<{ success: boolean; error?: string }> => {
    // Normalize the name for comparison
    const normalizedName = name.trim()
    
    // Validate name
    if (!normalizedName) {
      return { success: false, error: 'Category name cannot be empty' }
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = categories.some(
      cat => cat.name.toLowerCase() === normalizedName.toLowerCase()
    )
    if (isDuplicate) {
      return { success: false, error: 'A category with this name already exists' }
    }

    // Get a random color from the available colors
    const usedColors = new Set(categories.map(cat => cat.color))
    const availableColors = CATEGORY_COLORS.filter(color => !usedColors.has(color))
    const color = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)]

    // Create new category
    const newCategory: Category = {
      id: generateId(),
      name: normalizedName,
      color
    }

    setCategories(prev => [...prev, newCategory])
    return { success: true }
  }, [categories])

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
    // Remove category from tasks in this category
    setTasks(prev => prev.map(task => 
      task.category === id ? { ...task, category: '' } : task
    ))
  }, [])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        getTodayTasks,
        getUpcomingTasks,
        getTasksForCategory,
        toggleTaskCompletion,
        deleteTask,
        searchQuery,
        setSearchQuery,
        getFilteredTasks,
        categories,
        addCategory,
        deleteCategory
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskStore() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskStore must be used within a TaskProvider')
  }
  return context
} 