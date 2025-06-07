import { useTaskStore } from '../store/TaskContext'
import TaskList from '../components/TaskList/TaskList'

const Upcoming = () => {
  const { getUpcomingTasks } = useTaskStore()
  const upcomingTasks = getUpcomingTasks()

  return (
    <TaskList tasks={upcomingTasks} title="Upcoming Tasks" />
  )
}

export default Upcoming 