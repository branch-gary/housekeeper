import Modal from '../Modal/Modal'
import styles from './AddTaskModal.module.scss'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a Recurring Task">
      <form className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            id="taskName"
            placeholder="e.g., Clean kitchen counter"
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            placeholder="e.g., Kitchen"
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="recurrence">Recurrence</label>
          <select id="recurrence" defaultValue="">
            <option value="" disabled>Select frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton} disabled>
          Save Task
        </button>
      </form>
    </Modal>
  )
}

export default AddTaskModal 