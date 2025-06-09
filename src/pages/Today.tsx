import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import EmptyState from '../components/EmptyState'
import styles from './Today.module.scss'

export function Today() {
  console.log('Today: Rendering')
  
  let todayTasks = []
  let searchQuery = ''
  try {
    const { getTodayTasks, searchQuery: currentSearchQuery } = useTaskStore()
    todayTasks = getTodayTasks()
    searchQuery = currentSearchQuery
    console.log('Today: Got tasks:', { todayTasks, searchQuery })
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

  // Show search-specific empty state when no results are found
  if (todayTasks.length === 0 && searchQuery.trim()) {
    return (
      <div className={styles.today}>
        <EmptyState
          title="Nothing found"
          message="Nothing here right now — try another word?"
          actionLabel="Clear Search"
          onAction={() => {
            const { setSearchQuery } = useTaskStore()
            setSearchQuery('')
          }}
        />
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