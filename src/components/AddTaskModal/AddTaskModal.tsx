import { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import RecurrenceOptions from '../RecurrenceOptions/RecurrenceOptions'
import { useTaskStore } from '../../store/TaskContext'
import type { RecurrenceData } from '../../types/recurrence'
import styles from './AddTaskModal.module.scss'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  defaultCategoryId?: string
  onTaskAdded?: (task: {
    id: string
    name: string
    recurrence: RecurrenceData
  }) => void
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export default function AddTaskModal({ isOpen, onClose, defaultCategoryId, onTaskAdded }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategoryId || '')
  const [recurrence, setRecurrence] = useState<RecurrenceData>({
    type: 'daily',
    interval: 1,
    startDate: new Date().toISOString().split('T')[0]
  })

  const { categories } = useTaskStore()

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTaskName('')
      setSelectedCategoryId(defaultCategoryId || '')
      setRecurrence({
        type: 'daily',
        interval: 1,
        startDate: new Date().toISOString().split('T')[0]
      })
    }
  }, [isOpen, defaultCategoryId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskName.trim() || !selectedCategoryId) {
      return
    }

    const newTask = {
      id: generateId(),
      name: taskName.trim(),
      recurrence
    }

    // If we're in plan mode, just notify parent
    if (onTaskAdded) {
      onTaskAdded(newTask)
    }

    // Reset form
    setTaskName('')
    setRecurrence({
      type: 'daily',
      interval: 1,
      startDate: new Date().toISOString().split('T')[0]
    })

    // Close modal
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a Recurring Task">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g., Clean kitchen counter"
            autoComplete="off"
            autoFocus
          />
        </div>

        {!defaultCategoryId && (
          <div className={styles.field}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.field}>
          <label>Recurrence</label>
          <RecurrenceOptions
            value={recurrence}
            onChange={setRecurrence}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={!taskName.trim() || !selectedCategoryId}
        >
          Save Task
        </button>
      </form>
    </Modal>
  )
} 