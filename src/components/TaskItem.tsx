import { type Task } from '../types/task'
import { useTaskStore } from '../store/TaskContext'
import styles from './TaskItem.module.scss'
import { format } from 'date-fns'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskCompletion } = useTaskStore()

  return (
    <div className={`${styles.taskItem} ${task.isCompleted ? styles.completed : ''}`}>
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
          {task.category && <span className={styles.category}>{task.category}</span>}
          {task.nextDueDate && (
            <span className={styles.dueDate}>
              Due: {format(new Date(task.nextDueDate), 'MMM d, yyyy')}
            </span>
          )}
        </p>
      </div>
    </div>
  )
} 