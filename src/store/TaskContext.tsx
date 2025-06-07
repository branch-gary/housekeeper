import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Task, CreateTaskData } from '../types/task'
import { getNextDueDate } from '../utils/taskDate'

interface TaskContextType {
  tasks: Task[]
  addTask: (data: CreateTaskData) => void
  getTodayTasks: () => Task[]
  getUpcomingTasks: () => Task[]
}

const TaskContext = createContext<TaskContextType | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = useCallback((data: CreateTaskData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      nextDueDate: getNextDueDate(data.recurrence),
      isCompleted: false
    }

    setTasks(prev => [...prev, newTask])
  }, [])

  const getTodayTasks = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks.filter(task => {
      if (!task.nextDueDate) return false
      const dueDate = new Date(task.nextDueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() === today.getTime()
    })
  }, [tasks])

  const getUpcomingTasks = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks.filter(task => {
      if (!task.nextDueDate) return false
      const dueDate = new Date(task.nextDueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() > today.getTime()
    }).sort((a, b) => {
      if (!a.nextDueDate || !b.nextDueDate) return 0
      return a.nextDueDate.getTime() - b.nextDueDate.getTime()
    })
  }, [tasks])

  return (
    <TaskContext.Provider value={{ tasks, addTask, getTodayTasks, getUpcomingTasks }}>
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