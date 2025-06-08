import { useState } from 'react'
import Modal from '../Modal/Modal'
import { useTaskStore } from '../../store/TaskContext'
import { useToast } from '../Toast/ToastProvider'
import styles from './AddPlanModal.module.scss'

interface AddPlanModalProps {
  categoryName: string
  onClose: () => void
  onTasksAdded?: (tasks: string[]) => void
}

export default function AddPlanModal({ categoryName, onClose, onTasksAdded }: AddPlanModalProps) {
  const { addTask, categories } = useTaskStore()
  const { showToast } = useToast()
  const [tasks, setTasks] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Find category ID by name
  const category = categories.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  )

  if (!category) {
    showToast(`Category "${categoryName}" not found`, 'error')
    onClose()
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)

      // Split tasks by newline and filter out empty lines
      const taskList = tasks
        .split('\n')
        .map(task => task.trim())
        .filter(task => task.length > 0)

      if (taskList.length === 0) {
        showToast('Please enter at least one task', 'error')
        return
      }

      // Add all tasks at once
      const today = new Date().toISOString().split('T')[0]
      taskList.forEach(taskName => {
        addTask({
          name: taskName,
          category: category.id, // Make sure we're using the category ID
          recurrence: {
            type: 'daily',
            interval: 1,
            startDate: today
          }
        })
      })

      // Show a single success message
      const taskCount = taskList.length
      const taskWord = taskCount === 1 ? 'task' : 'tasks'
      showToast(`Added ${taskCount} ${taskWord} to ${category.name}`, 'success')

      // Call onTasksAdded callback if provided
      onTasksAdded?.(taskList)

      // Reset form and close modal
      setTasks('')
      onClose()
    } catch (error) {
      showToast('Failed to add tasks. Please try again.', 'error')
      console.error('Error adding tasks:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Plan tasks for ${category.name}`}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="tasks">Enter tasks below (one per line)</label>
          <textarea
            id="tasks"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder={`Examples for ${category.name}:${'\n'}${
              category.name === 'Kitchen' 
                ? 'Clean counters\nWipe appliances\nSweep floor'
                : category.name === 'Living Room'
                ? 'Vacuum carpet\nDust surfaces\nTidy coffee table'
                : category.name === 'Bathroom'
                ? 'Clean toilet\nWipe mirror\nMop floor'
                : 'Task 1\nTask 2\nTask 3'
            }`}
            rows={8}
            className={styles.textarea}
            autoFocus
          />
          <p className={styles.hint}>
            💡 Don't worry about being perfect — just list anything that comes to mind. You can always edit later.
          </p>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting || !tasks.trim()}
        >
          {isSubmitting ? 'Adding Tasks...' : 'Save Tasks'}
        </button>
      </form>
    </Modal>
  )
} 