import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import EmptyState from '../components/EmptyState/EmptyState'
import styles from './Category.module.scss'

export function Category() {
  const { categoryName } = useParams<{ categoryName: string }>()
  const { tasks, categories, getFilteredTasks } = useTaskStore()

  // Find the actual category object based on URL slug
  const category = useMemo(() => {
    if (!categoryName) return null
    const decodedName = categoryName.replace(/-/g, ' ')
    return categories.find(cat => 
      cat.name.toLowerCase() === decodedName.toLowerCase()
    )
  }, [categoryName, categories])

  // If category doesn't exist, redirect to Today view
  if (!category) {
    return <Navigate to="/" replace />
  }

  // Filter tasks for this category
  const categoryTasks = useMemo(() => {
    const filtered = tasks.filter(task => task.category === category.id)
    return getFilteredTasks(filtered)
  }, [tasks, category.id, getFilteredTasks])

  // Separate active and completed tasks
  const activeTasks = categoryTasks.filter(task => !task.isCompleted)
  const completedTasks = categoryTasks.filter(task => task.isCompleted)

  return (
    <div className={styles.categoryView}>
      <header className={styles.header}>
        <div className={styles.categoryIndicator}>
          <span 
            className={styles.categoryColor} 
            style={{ backgroundColor: category.color }}
          />
          <h1>{category.name}</h1>
        </div>
      </header>

      {categoryTasks.length === 0 ? (
        <EmptyState
          title={`No tasks in ${category.name}`}
          message="Add a task to get started!"
          actionLabel="Add Task"
          onAction={() => {/* Add task action will be implemented later */}}
        />
      ) : (
        <>
          {/* Active Tasks */}
          <TaskSection
            title={`${category.name} Tasks`}
            tasks={activeTasks}
            emptyMessage={`No active tasks in ${category.name}`}
            viewId={`category-${categoryName}`}
          />

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className={styles.completedSection}>
              <h2>Completed</h2>
              <TaskSection
                title="Completed Tasks"
                tasks={completedTasks}
                viewId={`category-${categoryName}-completed`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
} 