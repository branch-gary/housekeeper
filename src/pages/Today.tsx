import { useTaskStore } from '../store/TaskContext'
import { TaskItem } from '../components/TaskItem'
import styles from './Today.module.scss'

export function Today() {
  const { getTodayTasks } = useTaskStore()
  const todayTasks = getTodayTasks()

  return (
    <div className={styles.today}>
      <h1>Today's Tasks</h1>
      <div className={styles.taskList}>
        {todayTasks.length === 0 ? (
          <p className={styles.emptyState}>No tasks for today! 🎉</p>
        ) : (
          todayTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  )
} 