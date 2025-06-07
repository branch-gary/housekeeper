import styles from './Sidebar.module.scss'

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <button className={styles.addTask}>+ Add Task</button>
      <nav className={styles.nav}>
        <button>Today</button>
        <button>Upcoming</button>
      </nav>
    </aside>
  )
}

export default Sidebar 