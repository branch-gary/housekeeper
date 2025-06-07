import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddTaskModal from './AddTaskModal/AddTaskModal'
import PlanTasksModal from './PlanTasksModal/PlanTasksModal'
import styles from './Sidebar.module.scss'

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [planningCategory, setPlanningCategory] = useState<string | null>(null)

  const handlePlanClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent category click event
    setPlanningCategory(category)
  }

  return (
    <aside className={styles.sidebar}>
      <button 
        className={styles.addTask}
        onClick={() => setIsModalOpen(true)}
      >
        + Add Task
      </button>
      
      <nav className={styles.nav}>
        <div className={styles.mainNav}>
          <Link to="/">Today</Link>
          <Link to="/upcoming">Upcoming</Link>
        </div>

        <div className={styles.categories}>
          <h2 className={styles.categoryHeader}>Categories</h2>
          <ul className={styles.categoryList}>
            <li>
              <div className={styles.categoryWrapper}>
                <button className={styles.categoryButton}>
                  <span className={styles.categoryIcon} style={{ backgroundColor: '#4A90E2' }} />
                  Kitchen
                </button>
                <button 
                  className={styles.planButton}
                  onClick={(e) => handlePlanClick('Kitchen', e)}
                  aria-label="Plan tasks for Kitchen"
                >
                  Plan
                </button>
              </div>
            </li>
            <li>
              <div className={styles.categoryWrapper}>
                <button className={styles.categoryButton}>
                  <span className={styles.categoryIcon} style={{ backgroundColor: '#9B59B6' }} />
                  Living Room
                </button>
                <button 
                  className={styles.planButton}
                  onClick={(e) => handlePlanClick('Living Room', e)}
                  aria-label="Plan tasks for Living Room"
                >
                  Plan
                </button>
              </div>
            </li>
            <li>
              <div className={styles.categoryWrapper}>
                <button className={styles.categoryButton}>
                  <span className={styles.categoryIcon} style={{ backgroundColor: '#2ECC71' }} />
                  Bathroom
                </button>
                <button 
                  className={styles.planButton}
                  onClick={(e) => handlePlanClick('Bathroom', e)}
                  aria-label="Plan tasks for Bathroom"
                >
                  Plan
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <PlanTasksModal
        isOpen={planningCategory !== null}
        onClose={() => setPlanningCategory(null)}
        category={planningCategory || ''}
      />
    </aside>
  )
}

export default Sidebar 