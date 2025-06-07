import { useTaskStore } from '../store/TaskContext'
import TaskList from '../components/TaskList/TaskList'

const Today = () => {
  const { getTodayTasks } = useTaskStore()
  const todayTasks = getTodayTasks()

  return (
    <TaskList tasks={todayTasks} title="Today's Tasks" />
  )
}

export default Today 