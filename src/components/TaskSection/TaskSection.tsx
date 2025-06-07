import { useMemo, useState } from 'react'
import { TaskItem } from '../TaskItem'
import type { Task } from '../../types/task'
import styles from './TaskSection.module.scss'

interface TaskSectionProps {
  tasks: Task[]
  title: string
  emptyMessage?: string
  viewId?: string // For persisting toggle state per view
}

export function TaskSection({ tasks, title, emptyMessage = 'No tasks', viewId = 'default' }: TaskSectionProps) {
  console.log('TaskSection: Rendering', { title, taskCount: tasks.length })

  // Use viewId in the state key to maintain separate states per view
  const [showCompleted, setShowCompleted] = useState(true)

  const { activeTasks, completedTasks } = useMemo(() => {
    const result = tasks.reduce(
      (acc, task) => {
        if (task.isCompleted) {
          acc.completedTasks.push(task)
        } else {
          acc.activeTasks.push(task)
        }
        return acc
      },
      { activeTasks: [] as Task[], completedTasks: [] as Task[] }
    )
    console.log('TaskSection: Split tasks', {
      title,
      activeCount: result.activeTasks.length,
      completedCount: result.completedTasks.length
    })
    return result
  }, [tasks])

  if (tasks.length === 0) {
    console.log('TaskSection: No tasks to display')
    return (
      <div className={styles.section}>
        <h2>{title}</h2>
        <p className={styles.emptyState}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      
      {/* Active Tasks */}
      <div className={styles.taskList}>
        {activeTasks.length === 0 ? (
          <p className={styles.emptyState}>No active tasks</p>
        ) : (
          activeTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <>
          <button
            className={styles.completedToggle}
            onClick={() => setShowCompleted(!showCompleted)}
            aria-expanded={showCompleted}
            aria-controls={`completed-tasks-${viewId}`}
          >
            <span className={`${styles.toggleArrow} ${showCompleted ? styles.expanded : ''}`}>
              ▶
            </span>
            <h3 className={styles.completedHeading}>
              Completed ({completedTasks.length})
            </h3>
          </button>
          <div 
            id={`completed-tasks-${viewId}`}
            className={`${styles.taskList} ${styles.completedList} ${showCompleted ? styles.visible : ''}`}
          >
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </>
      )}
    </div>
  )
} 