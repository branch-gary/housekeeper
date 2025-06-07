import { Link } from 'react-router-dom'
import styles from './Sidebar.module.scss'

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <button className={styles.addTask}>+ Add Task</button>
      
      <nav className={styles.nav}>
        <div className={styles.mainNav}>
          <Link to="/">Today</Link>
          <Link to="/upcoming">Upcoming</Link>
        </div>

        <div className={styles.categories}>
          <h2 className={styles.categoryHeader}>Categories</h2>
          <ul className={styles.categoryList}>
            <li>
              <button className={styles.categoryButton}>
                <span className={styles.categoryIcon} style={{ backgroundColor: '#4A90E2' }} />
                Kitchen
              </button>
            </li>
            <li>
              <button className={styles.categoryButton}>
                <span className={styles.categoryIcon} style={{ backgroundColor: '#9B59B6' }} />
                Living Room
              </button>
            </li>
            <li>
              <button className={styles.categoryButton}>
                <span className={styles.categoryIcon} style={{ backgroundColor: '#2ECC71' }} />
                Bathroom
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar 