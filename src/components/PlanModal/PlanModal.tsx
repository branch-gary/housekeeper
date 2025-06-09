import { useState } from 'react'
import { format } from 'date-fns'
import Modal from '../Modal/Modal'
import AddTaskModal from '../AddTaskModal/AddTaskModal'
import { useTaskStore } from '../../store/TaskContext'
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
    startDate: string
  }
}

export default function PlanModal({ categoryId, categoryName, onClose, onTasksAdded }: PlanModalProps) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [addedTasks, setAddedTasks] = useState<AddedTask[]>([])
  const { addTask } = useTaskStore()
  const { showToast } = useToast()

  const handleAddTaskClick = () => {
    setIsAddTaskModalOpen(true)
  }

  const handleTaskAdded = (task: AddedTask) => {
    setAddedTasks(prev => [...prev, task])
    setIsAddTaskModalOpen(false)
  }

  const handleSavePlan = () => {
    if (addedTasks.length === 0) {
      showToast('Please add at least one task', 'error')
      return
    }

    // Add all tasks
    addedTasks.forEach(task => {
      addTask({
        name: task.name,
        category: categoryId,
        recurrence: task.recurrence
      })
    })

    // Show success message
    const taskCount = addedTasks.length
    showToast(
      `Added ${taskCount} ${taskCount === 1 ? 'task' : 'tasks'} to ${categoryName}`,
      'success'
    )

    // Call callback if provided
    onTasksAdded?.(addedTasks.map(t => t.name))

    // Close modal
    onClose()
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
      onClose={onClose}
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

        {addedTasks.length > 0 && (
          <div className={styles.taskListSection}>
            <h3 className={styles.taskListTitle}>Tasks You've Added</h3>
            <div className={styles.taskList}>
              {addedTasks.map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskInfo}>
                    <span className={styles.taskName}>{task.name}</span>
                    <span className={styles.taskFrequency}>
                      {getRecurrenceLabel(task.recurrence)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            onClick={handleSavePlan}
            className={styles.saveButton}
            disabled={addedTasks.length === 0}
          >
            Save Plan
          </button>
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        defaultCategoryId={categoryId}
        onTaskAdded={handleTaskAdded}
      />
    </Modal>
  )
} 