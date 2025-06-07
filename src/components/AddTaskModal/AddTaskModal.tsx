import { useState } from 'react'
import Modal from '../Modal/Modal'
import RecurrenceOptions from '../RecurrenceOptions/RecurrenceOptions'
import type { RecurrenceData } from '../../types/recurrence'
import styles from './AddTaskModal.module.scss'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
  const [taskName, setTaskName] = useState('')
  const [category, setCategory] = useState('')
  const [recurrence, setRecurrence] = useState<RecurrenceData>({
    type: 'weekly',
    interval: 1,
    startDate: null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a Recurring Task">
      <form className={styles.form} onSubmit={handleSubmit}>
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
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Kitchen"
            autoComplete="off"
          />
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
          disabled={!taskName.trim() || !category.trim()}
        >
          Save Task
        </button>
      </form>
    </Modal>
  )
}

export default AddTaskModal 