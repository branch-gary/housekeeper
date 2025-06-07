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

interface TaskContextType {
  tasks: Task[]
  addTask: (data: CreateTaskData) => void
  getTodayTasks: () => Task[]
  getUpcomingTasks: () => Task[]
  toggleTaskCompletion: (taskId: string) => void
  deleteTask: (taskId: string) => void
}

const TaskContext = createContext<TaskContextType | null>(null)

const STORAGE_KEY = 'housekeeper_tasks'

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

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error)
    }
  }, [tasks])

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

  const getTodayTasks = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    console.log('Filtering today tasks:', { today, tomorrow })
    return tasks.filter(task => {
      if (!task.nextDueDate) return false
      try {
        const dueDate = new Date(task.nextDueDate)
        dueDate.setHours(0, 0, 0, 0)
        const isToday = dueDate >= today && dueDate < tomorrow
        console.log('Task due date check:', {
          taskName: task.name,
          dueDate,
          isToday
        })
        return isToday
      } catch (error) {
        console.error('Error processing task date:', error, task)
        return false
      }
    })
  }, [tasks])

  const getUpcomingTasks = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's tasks for filtering
    const todaysTasks = getTodayTasks()
    const todayTaskIds = new Set(todaysTasks.map(task => task.id))

    return tasks
      .filter(task => {
        if (!task.nextDueDate) return false
        try {
          // Skip if this task is already in today's list
          if (todayTaskIds.has(task.id)) return false
          
          const dueDate = new Date(task.nextDueDate)
          dueDate.setHours(0, 0, 0, 0)
          // Include all future tasks (including those due today but not in today's list)
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
  }, [tasks, getTodayTasks])

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      getTodayTasks, 
      getUpcomingTasks,
      toggleTaskCompletion,
      deleteTask
    }}>
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