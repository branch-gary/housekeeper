import { useState } from 'react'
import Modal from '../Modal/Modal'
import { useTaskStore } from '../../store/TaskContext'
import styles from './PlanTasksModal.module.scss'

interface PlanTasksModalProps {
  isOpen: boolean
  onClose: () => void
  category: string
}

export default function PlanTasksModal({ isOpen, onClose, category }: PlanTasksModalProps) {
  const { addTask } = useTaskStore()
  const [tasks, setTasks] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Split tasks by newline and filter out empty lines
    const taskList = tasks
      .split('\n')
      .map(task => task.trim())
      .filter(task => task.length > 0)

    // Add each task with daily recurrence
    taskList.forEach(taskName => {
      addTask({
        name: taskName,
        category,
        recurrence: {
          type: 'daily',
          interval: 1,
          startDate: new Date().toISOString().split('T')[0]
        }
      })
    })

    // Reset form and close modal
    setTasks('')
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Plan Tasks - ${category}`}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="tasks">Enter Tasks (one per line)</label>
          <textarea
            id="tasks"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Clean counters&#10;Wipe appliances&#10;Sweep floor"
            rows={8}
            className={styles.textarea}
          />
        </div>

        <p className={styles.hint}>
          Each task will be set to repeat daily starting today
        </p>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={!tasks.trim()}
        >
          Add Tasks
        </button>
      </form>
    </Modal>
  )
} 