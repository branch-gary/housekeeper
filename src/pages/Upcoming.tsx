import { useMemo } from 'react'
import { format } from 'date-fns'
import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import EmptyState from '../components/EmptyState'
import type { Task } from '../types/task'
import styles from './Upcoming.module.scss'

interface TasksByDate {
  [date: string]: Task[]
}

export function Upcoming() {
  const { getUpcomingTasks, searchQuery, setSearchQuery } = useTaskStore()
  const upcomingTasks = getUpcomingTasks()

  const tasksByDate = useMemo(() => {
    return upcomingTasks.reduce((acc: TasksByDate, task) => {
      if (!task.nextDueDate) return acc
      
      const dateKey = format(new Date(task.nextDueDate), 'yyyy-MM-dd')
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(task)
      return acc
    }, {})
  }, [upcomingTasks])

  const sortedDates = useMemo(() => {
    return Object.keys(tasksByDate).sort()
  }, [tasksByDate])

  // Show search-specific empty state when no results are found
  if (upcomingTasks.length === 0 && searchQuery.trim()) {
    return (
      <div className={styles.upcoming}>
        <EmptyState 
          title="Nothing found"
          message="Nothing here right now — try another word?"
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      </div>
    )
  }

  // Show regular empty state when there are no upcoming tasks
  if (upcomingTasks.length === 0) {
    return (
      <div className={styles.upcoming}>
        <TaskSection
          title="Upcoming Tasks"
          tasks={[]}
          emptyMessage="No upcoming tasks! 🎉"
          viewId="upcoming"
        />
      </div>
    )
  }

  return (
    <div className={styles.upcoming}>
      <h1>Upcoming Tasks</h1>
      {sortedDates.map(dateKey => {
        const date = new Date(dateKey)
        const formattedDate = format(date, 'EEEE, MMMM d')
        return (
          <TaskSection
            key={dateKey}
            title={formattedDate}
            tasks={tasksByDate[dateKey]}
            viewId={`upcoming-${dateKey}`}
          />
        )
      })}
    </div>
  )
} 