import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import styles from './Today.module.scss'

export function Today() {
  console.log('Today: Rendering')
  
  let todayTasks = []
  try {
    const { getTodayTasks } = useTaskStore()
    todayTasks = getTodayTasks()
    console.log('Today: Got tasks:', todayTasks)
  } catch (error) {
    console.error('Today: Error getting tasks:', error)
    return (
      <div className={styles.today}>
        <h1>Error</h1>
        <p>Failed to load tasks. Please try refreshing the page.</p>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
      </div>
    )
  }

  return (
    <div className={styles.today}>
      <TaskSection 
        title="Today's Tasks" 
        tasks={todayTasks}
        emptyMessage="No tasks for today! 🎉"
        viewId="today"
      />
    </div>
  )
} 