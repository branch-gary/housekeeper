import { useTaskStore } from '../store/TaskContext'
import { TaskItem } from '../components/TaskItem'
import styles from './Upcoming.module.scss'

export function Upcoming() {
  const { getUpcomingTasks } = useTaskStore()
  const upcomingTasks = getUpcomingTasks()

  return (
    <div className={styles.upcoming}>
      <h1>Upcoming Tasks</h1>
      <div className={styles.taskList}>
        {upcomingTasks.length === 0 ? (
          <p className={styles.emptyState}>No upcoming tasks! 🎉</p>
        ) : (
          upcomingTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  )
} 