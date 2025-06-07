import { Link } from 'react-router-dom'
import styles from './Sidebar.module.scss'

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <button className={styles.addTask}>+ Add Task</button>
      <nav className={styles.nav}>
        <Link to="/">Today</Link>
        <Link to="/upcoming">Upcoming</Link>
      </nav>
    </aside>
  )
}

export default Sidebar 