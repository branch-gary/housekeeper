import { useState } from 'react'
import Modal from '../Modal/Modal'
import RecurrenceOptions from '../RecurrenceOptions/RecurrenceOptions'
import { useTaskStore } from '../../store/TaskContext'
import type { RecurrenceData } from '../../types/recurrence'
import styles from './AddTaskModal.module.scss'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const initialRecurrence: RecurrenceData = {
  type: 'weekly',
  interval: 1,
  startDate: null
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { addTask, categories } = useTaskStore()
  const [taskName, setTaskName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [recurrence, setRecurrence] = useState<RecurrenceData>(initialRecurrence)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!taskName.trim() || !selectedCategoryId) return

    addTask({
      name: taskName.trim(),
      category: selectedCategoryId,
      recurrence
    })

    // Reset form
    setTaskName('')
    setSelectedCategoryId('')
    setRecurrence(initialRecurrence)
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
          />
        </div>

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