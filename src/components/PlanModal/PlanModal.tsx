import { useState, useEffect, useCallback, useRef } from 'react'
import { format } from 'date-fns'
import Modal from '../Modal/Modal'
import AddTaskModal from '../AddTaskModal/AddTaskModal'
import { useTaskStore } from '../../store/TaskContext'
import { usePlan } from '../../store/PlanContext'
import { useToast } from '../Toast/ToastProvider'
import styles from './PlanModal.module.scss'

interface PlanModalProps {
  categoryId: string
  categoryName: string
  onClose: () => void
  onTasksAdded?: (tasks: string[]) => void
}

interface AddedTask {
  id: string
  name: string
  recurrence: {
    type: 'daily' | 'weekly' | 'monthly-date' | 'monthly-day' | 'yearly'
    interval: number
    startDate: string | null
  }
}

interface ConfirmDeleteProps {
  taskName: string
  onConfirm: () => void
  onCancel: () => void
}

interface ConfirmCloseProps {
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDelete({ taskName, onConfirm, onCancel }: ConfirmDeleteProps) {
  return (
    <div className={styles.confirmDelete}>
      <p>Are you sure you want to remove "{taskName}" from your plan?</p>
      <div className={styles.confirmActions}>
        <button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button onClick={onConfirm} className={styles.removeButton}>
          Remove
        </button>
      </div>
    </div>
  )
}

function ConfirmClose({ onConfirm, onCancel }: ConfirmCloseProps) {
  return (
    <div className={styles.confirmDelete}>
      <p>You have unsaved tasks in your plan. Would you like to discard them?</p>
      <div className={styles.confirmActions}>
        <button onClick={onCancel} className={styles.cancelButton}>
          Keep Editing
        </button>
        <button onClick={onConfirm} className={styles.removeButton}>
          Discard Plan
        </button>
      </div>
    </div>
  )
}

export default function PlanModal({ categoryId, categoryName, onClose, onTasksAdded }: PlanModalProps) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<AddedTask | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<AddedTask | null>(null)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { addTask } = useTaskStore()
  const { showToast } = useToast()
  const {
    getTemporaryTasks,
    addTemporaryTask,
    updateTemporaryTask,
    removeTemporaryTask,
    clearTemporaryTasks
  } = usePlan()
  const [deletingTaskIds, setDeletingTaskIds] = useState<Set<string>>(new Set())

  const addedTasks = getTemporaryTasks(categoryId)

  const handleAddTaskClick = () => {
    setEditingTask(null)
    setIsAddTaskModalOpen(true)
  }

  const handleEditTask = (task: AddedTask) => {
    setEditingTask(task)
    setIsAddTaskModalOpen(true)
  }

  const handleDeleteTask = useCallback((task: AddedTask) => {
    setTaskToDelete(task)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!taskToDelete) return

    // Start delete animation
    setDeletingTaskIds(prev => new Set([...prev, taskToDelete.id]))

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 250))

    // Remove task from list
    removeTemporaryTask(categoryId, taskToDelete.id)
    setTaskToDelete(null)
    setDeletingTaskIds(prev => {
      const next = new Set(prev)
      next.delete(taskToDelete.id)
      return next
    })
    showToast('Task removed from plan', 'success')
  }, [taskToDelete, categoryId, removeTemporaryTask, showToast])

  const handleTaskAdded = (task: AddedTask) => {
    // Ensure startDate is a string (use today's date if null)
    const taskWithStartDate = {
      ...task,
      recurrence: {
        ...task.recurrence,
        startDate: task.recurrence.startDate || format(new Date(), 'yyyy-MM-dd')
      }
    }

    if (editingTask) {
      // Replace existing task
      updateTemporaryTask(categoryId, editingTask.id, taskWithStartDate)
      setEditingTask(null)
      showToast('Task updated', 'success')
    } else {
      // Add new task
      addTemporaryTask(categoryId, {
        ...taskWithStartDate,
        categoryId
      })
    }
    setIsAddTaskModalOpen(false)
  }

  const handleCloseAttempt = () => {
    if (addedTasks.length > 0) {
      setShowConfirmClose(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    clearTemporaryTasks(categoryId)
    onClose()
  }

  const validateTasks = (tasks: AddedTask[]): boolean => {
    // Check for empty tasks
    if (tasks.length === 0) {
      showToast('Please add at least one task', 'error')
      return false
    }

    // Check for duplicate IDs
    const ids = new Set()
    for (const task of tasks) {
      if (ids.has(task.id)) {
        showToast('Error: Duplicate task IDs detected', 'error')
        return false
      }
      ids.add(task.id)
    }

    // Validate task data structure
    for (const task of tasks) {
      if (!task.name.trim()) {
        showToast('Error: Empty task name detected', 'error')
        return false
      }
      if (!task.recurrence || 
          !task.recurrence.type || 
          !task.recurrence.interval || 
          !task.recurrence.startDate) {
        showToast('Error: Invalid recurrence settings detected', 'error')
        return false
      }
    }

    return true
  }

  const handleSavePlan = async () => {
    try {
      // Validate tasks before saving
      if (!validateTasks(addedTasks)) {
        return
      }

      setIsSaving(true)

      // Add all tasks
      for (const task of addedTasks) {
        await addTask({
          name: task.name,
          category: categoryId,
          recurrence: task.recurrence
        })
      }

      // Show success message
      const taskCount = addedTasks.length
      showToast(
        `Added ${taskCount} ${taskCount === 1 ? 'task' : 'tasks'} to ${categoryName} and Today's List`,
        'success'
      )

      // Clear temporary tasks
      clearTemporaryTasks(categoryId)

      // Call callback if provided
      onTasksAdded?.(addedTasks.map(t => t.name))

      // Close modal
      onClose()
    } catch (error) {
      console.error('Error saving tasks:', error)
      showToast('Failed to save tasks. Please try again.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const getRecurrenceLabel = (recurrence: AddedTask['recurrence']) => {
    const { type, interval } = recurrence
    const unit = type === 'daily' ? 'day' : 
                type === 'weekly' ? 'week' :
                type === 'monthly-date' ? 'month' :
                type === 'monthly-day' ? 'month' :
                'year'
    return `Every ${interval} ${unit}${interval > 1 ? 's' : ''}`
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleCloseAttempt}
      title={`🧠 Let's make a plan for your ${categoryName}`}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.message}>
            Take a moment to step into the {categoryName}. Look around.<br/>
            Think about everything — big chores, small habits, things you forget, things you do often.<br/>
            This is your space, your plan.
          </p>
        </div>

        <div className={styles.addTaskSection}>
          <button
            onClick={handleAddTaskClick}
            className={styles.addTaskButton}
          >
            + Add a task
          </button>
        </div>

        <div className={styles.taskListSection}>
          <h3 className={styles.taskListTitle}>Tasks You've Added</h3>
          <p className={styles.taskListMessage}>
            Here's your plan so far — you can edit or remove anything before saving.
          </p>
          {addedTasks.length === 0 ? (
            <p className={styles.emptyMessage}>
              No tasks yet. Click "+ Add a task" to begin planning this space.
            </p>
          ) : (
            <div className={styles.taskList} role="list">
              {addedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={styles.taskCard}
                  role="listitem"
                  data-task-id={task.id}
                  data-deleting={deletingTaskIds.has(task.id)}
                >
                  <div className={styles.taskInfo}>
                    <span className={styles.taskName}>{task.name}</span>
                    <span className={styles.taskFrequency}>
                      {getRecurrenceLabel(task.recurrence)}
                    </span>
                  </div>
                  <div className={styles.taskActions}>
                    <button
                      onClick={() => handleEditTask(task)}
                      className={styles.editButton}
                      aria-label={`Edit task: ${task.name}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task)}
                      className={styles.deleteButton}
                      aria-label={`Delete task: ${task.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className={styles.helperText}>
          No rush — your plan will stay right here if you need a break.
        </p>

        {taskToDelete && (
          <ConfirmDelete
            taskName={taskToDelete.name}
            onConfirm={handleConfirmDelete}
            onCancel={() => setTaskToDelete(null)}
          />
        )}

        {showConfirmClose && (
          <ConfirmClose
            onConfirm={handleConfirmClose}
            onCancel={() => setShowConfirmClose(false)}
          />
        )}

        <div className={styles.actions}>
          <button
            onClick={handleCloseAttempt}
            className={styles.cancelButton}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSavePlan}
            className={styles.saveButton}
            disabled={addedTasks.length === 0 || isSaving}
          >
            {isSaving ? (
              <span className={styles.savingState}>
                <span className={styles.spinner} />
                Saving...
              </span>
            ) : (
              'Save Plan'
            )}
          </button>
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => {
          setIsAddTaskModalOpen(false)
          setEditingTask(null)
        }}
        defaultCategoryId={categoryId}
        onTaskAdded={handleTaskAdded}
        editingTask={editingTask}
      />
    </Modal>
  )
} 