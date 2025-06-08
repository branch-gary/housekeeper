import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import EmptyState from '../components/EmptyState'
import PlanTasksModal from '../components/PlanTasksModal/PlanTasksModal'
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
  const { tasks, searchQuery, getFilteredTasks } = useTaskStore()
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false)
  
  // Filter tasks by category, safely handling undefined categories
  const categoryTasks = tasks.filter(task => {
    if (!task.category || !categoryName) return false
    return normalizeCategory(task.category) === normalizeCategory(categoryName)
  })

  // Apply search filter
  const filteredTasks = getFilteredTasks(categoryTasks)

  // Convert URL-friendly category name to display name
  const displayName = categoryName
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Unknown Category'

  // Show empty state when there are no tasks at all
  const hasNoTasks = categoryTasks.length === 0
  const hasNoFilteredTasks = filteredTasks.length === 0

  console.log('Category rendering:', {
    categoryName,
    displayName,
    tasksCount: tasks.length,
    categoryTasksCount: categoryTasks.length,
    filteredTasksCount: filteredTasks.length,
    hasNoTasks,
    hasNoFilteredTasks,
    searchQuery
  })

  // Get active and completed tasks
  const activeTasks = filteredTasks.filter(task => !task.isCompleted)
  const hasNoActiveTasks = activeTasks.length === 0

  console.log('Category: Task breakdown', {
    totalTasks: filteredTasks.length,
    activeTasks: activeTasks.length,
    hasNoActiveTasks
  })

  if (hasNoTasks) {
    console.log('Category: Rendering empty state')
    return (
      <div className={styles.category}>
        <EmptyState 
          title={`Let's get ${displayName} organized`}
          message={`No tasks in ${displayName} yet — want to add a few ideas?`}
          actionLabel="📝 Plan Tasks"
          onAction={() => setIsPlanningModalOpen(true)}
        />
        {isPlanningModalOpen && (
          <PlanTasksModal
            isOpen={isPlanningModalOpen}
            onClose={() => setIsPlanningModalOpen(false)}
            category={displayName}
          />
        )}
      </div>
    )
  }

  if (hasNoFilteredTasks && searchQuery.trim()) {
    return (
      <div className={styles.category}>
        <EmptyState 
          title="Nothing found"
          message="Nothing here right now — try another word?"
          actionLabel="Clear Search"
          onAction={() => setIsPlanningModalOpen(true)}
        />
      </div>
    )
  }

  return (
    <div className={styles.category}>
      <TaskSection 
        title={`${displayName} Tasks`}
        tasks={filteredTasks}
        emptyMessage={`No active tasks in ${displayName} yet`}
        viewId={`category-${categoryName}`}
        showEmptyState={true}
        onEmptyAction={() => setIsPlanningModalOpen(true)}
      />
      {isPlanningModalOpen && (
        <PlanTasksModal
          isOpen={isPlanningModalOpen}
          onClose={() => setIsPlanningModalOpen(false)}
          category={displayName}
        />
      )}
    </div>
  )
} 