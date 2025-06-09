import React, { createContext, useContext, useState, useCallback } from 'react'
import type { RecurrenceData } from '../types/recurrence'

interface PlanTask {
  id: string
  name: string
  categoryId: string
  recurrence: {
    type: 'daily' | 'weekly' | 'monthly-date' | 'monthly-day' | 'yearly'
    interval: number
    startDate: string
  }
}

interface PlanContextType {
  temporaryTasks: Record<string, PlanTask[]> // Keyed by categoryId
  addTemporaryTask: (categoryId: string, task: PlanTask) => void
  updateTemporaryTask: (categoryId: string, taskId: string, updates: Partial<PlanTask>) => void
  removeTemporaryTask: (categoryId: string, taskId: string) => void
  clearTemporaryTasks: (categoryId: string) => void
  getTemporaryTasks: (categoryId: string) => PlanTask[]
}

const PlanContext = createContext<PlanContextType | null>(null)

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [temporaryTasks, setTemporaryTasks] = useState<Record<string, PlanTask[]>>({})

  const addTemporaryTask = useCallback((categoryId: string, task: PlanTask) => {
    setTemporaryTasks(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), task]
    }))
  }, [])

  const updateTemporaryTask = useCallback((categoryId: string, taskId: string, updates: Partial<PlanTask>) => {
    setTemporaryTasks(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }))
  }, [])

  const removeTemporaryTask = useCallback((categoryId: string, taskId: string) => {
    setTemporaryTasks(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).filter(task => task.id !== taskId)
    }))
  }, [])

  const clearTemporaryTasks = useCallback((categoryId: string) => {
    setTemporaryTasks(prev => {
      const newTasks = { ...prev }
      delete newTasks[categoryId]
      return newTasks
    })
  }, [])

  const getTemporaryTasks = useCallback((categoryId: string) => {
    return temporaryTasks[categoryId] || []
  }, [temporaryTasks])

  return (
    <PlanContext.Provider
      value={{
        temporaryTasks,
        addTemporaryTask,
        updateTemporaryTask,
        removeTemporaryTask,
        clearTemporaryTasks,
        getTemporaryTasks
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const context = useContext(PlanContext)
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider')
  }
  return context
} 