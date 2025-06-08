import { useParams } from 'react-router-dom'
import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import styles from './Category.module.scss'

// Helper function to normalize category names for comparison
function normalizeCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function Category() {
  const { categoryName } = useParams()
  const { tasks } = useTaskStore()
  
  // Filter tasks by category, safely handling undefined categories
  const categoryTasks = tasks.filter(task => {
    if (!task.category || !categoryName) return false
    return normalizeCategory(task.category) === normalizeCategory(categoryName)
  })

  // Convert URL-friendly category name to display name
  const displayName = categoryName
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Unknown Category'

  return (
    <div className={styles.category}>
      <TaskSection 
        title={`${displayName} Tasks`}
        tasks={categoryTasks}
        emptyMessage={`No tasks in ${displayName}`}
        viewId={`category-${categoryName}`}
      />
    </div>
  )
} 