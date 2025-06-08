import { useState } from 'react'
import { type Task } from '../types/task'
import { useTaskStore } from '../store/TaskContext'
import { ConfirmDialog } from './ConfirmDialog/ConfirmDialog'
import styles from './TaskItem.module.scss'
import { format } from 'date-fns'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  console.log('TaskItem: Rendering', { taskId: task.id, taskName: task.name })
  
  const { toggleTaskCompletion, deleteTask, categories } = useTaskStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Find category name
  const category = categories.find(cat => cat.id === task.category)

  const handleDelete = () => {
    console.log('Starting delete process for task:', task.id)
    setIsDeleting(true)
    // Close the dialog first
    setShowConfirmDialog(false)
    // Wait for animation to complete before actually deleting
    setTimeout(() => {
      console.log('Executing delete for task:', task.id)
      deleteTask(task.id)
    }, 300) // Match this with CSS animation duration
  }

  const handleDeleteClick = () => {
    console.log('Delete button clicked for task:', task.id)
    setShowConfirmDialog(true)
  }

  return (
    <>
      <div 
        className={`
          ${styles.taskItem} 
          ${task.isCompleted ? styles.completed : ''} 
          ${isDeleting ? styles.deleting : ''}
        `}
      >
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => toggleTaskCompletion(task.id)}
          />
          <span className={styles.checkmark}></span>
        </label>
        <div className={styles.taskContent}>
          <h3 className={styles.taskName}>{task.name}</h3>
          <p className={styles.taskDetails}>
            {category && (
              <span 
                className={styles.category}
                style={{ backgroundColor: category.color + '20' }}
              >
                {category.name}
              </span>
            )}
            {task.nextDueDate && (
              <span className={styles.dueDate}>
                Due: {format(new Date(task.nextDueDate), 'MMM d, yyyy')}
              </span>
            )}
          </p>
        </div>
        <button
          className={styles.deleteButton}
          onClick={handleDeleteClick}
          aria-label={`Delete task: ${task.name}`}
        >
          ×
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.name}"?`}
      />
    </>
  )
} 