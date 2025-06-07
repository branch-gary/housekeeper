import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import styles from './Today.module.scss'

export function Today() {
  const { getTodayTasks } = useTaskStore()
  const todayTasks = getTodayTasks()

  return (
    <div className={styles.today}>
      <TaskSection 
        title="Today's Tasks" 
        tasks={todayTasks}
        emptyMessage="No tasks for today! 🎉"
      />
    </div>
  )
} 