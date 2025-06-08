import { useMemo, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import EmptyState from '../components/EmptyState/EmptyState'
import AddTaskModal from '../components/AddTaskModal/AddTaskModal'
import styles from './Category.module.scss'

export function Category() {
  const { categoryName } = useParams<{ categoryName: string }>()
  const { tasks, categories, getFilteredTasks } = useTaskStore()
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)

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

  const handleAddTaskClick = () => {
    setIsAddTaskModalOpen(true)
  }

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

      {activeTasks.length === 0 ? (
        <div className={styles.emptyStateWrapper}>
          <EmptyState
            title={`✨ ${category.name} is looking pretty calm right now`}
            message="Ready to plan some tasks? Take it one step at a time - no pressure!"
            actionLabel="Add a task"
            onAction={handleAddTaskClick}
            icon="🌟"
          />
        </div>
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
            <TaskSection
              title="Completed"
              tasks={completedTasks}
              viewId={`category-${categoryName}-completed`}
            />
          )}
        </>
      )}

      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        defaultCategoryId={category.id}
      />
    </div>
  )
} 