import type { Task } from '../../types/task'
import { getRecurrencePreview } from '../../utils/recurrencePreview'
import styles from './TaskList.module.scss'

interface TaskListProps {
  tasks: Task[]
  title: string
}

const TaskList = ({ tasks, title }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>{title}</h2>
        <p>No tasks scheduled</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <ul className={styles.list}>
        {tasks.map(task => (
          <li key={task.id} className={styles.task}>
            <div className={styles.taskHeader}>
              <h3>{task.name}</h3>
              <span className={styles.category}>{task.category}</span>
            </div>
            <div className={styles.taskDetails}>
              <span className={styles.recurrence}>
                {getRecurrencePreview(task.recurrence)}
              </span>
              {task.nextDueDate && (
                <span className={styles.dueDate}>
                  Next due: {new Date(task.nextDueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList 