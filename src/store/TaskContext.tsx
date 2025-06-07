import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Task, CreateTaskData } from '../types/task'
import { getNextDueDate } from '../utils/taskDate'

interface TaskContextType {
  tasks: Task[]
  addTask: (data: CreateTaskData) => void
  getTodayTasks: () => Task[]
  getUpcomingTasks: () => Task[]
  toggleTaskCompletion: (taskId: string) => void
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

  const getTodayTasks = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    console.log('Filtering today tasks:', { today, tomorrow })
    return tasks.filter(task => {
      if (!task.nextDueDate) return false
      const dueDate = new Date(task.nextDueDate)
      dueDate.setHours(0, 0, 0, 0)
      const isToday = dueDate >= today && dueDate < tomorrow
      console.log('Task due date check:', {
        taskName: task.name,
        dueDate,
        isToday
      })
      return isToday
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
        // Skip if this task is already in today's list
        if (todayTaskIds.has(task.id)) return false
        
        const dueDate = new Date(task.nextDueDate)
        dueDate.setHours(0, 0, 0, 0)
        // Include all future tasks (including those due today but not in today's list)
        return dueDate >= today
      })
      .sort((a, b) => {
        if (!a.nextDueDate || !b.nextDueDate) return 0
        return a.nextDueDate.getTime() - b.nextDueDate.getTime()
      })
  }, [tasks, getTodayTasks])

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      getTodayTasks, 
      getUpcomingTasks,
      toggleTaskCompletion 
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