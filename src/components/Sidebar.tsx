import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AddTaskModal from './AddTaskModal/AddTaskModal'
import PlanTasksModal from './PlanTasksModal/PlanTasksModal'
import styles from './Sidebar.module.scss'

interface SidebarProps {
  onMobileClose?: () => void
}

const Sidebar = ({ onMobileClose }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [planningCategory, setPlanningCategory] = useState<string | null>(null)
  const location = useLocation()

  const handlePlanClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent category click event
    setPlanningCategory(category)
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  const isActiveCategory = (category: string) => {
    return location.pathname === `/category/${category.toLowerCase()}`
  }

  return (
    <aside className={styles.sidebar}>
      {/* Mobile Close Button */}
      {onMobileClose && (
        <button 
          className={styles.mobileCloseButton}
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          ×
        </button>
      )}

      <button 
        className={styles.addTask}
        onClick={() => setIsModalOpen(true)}
      >
        + Add Task
      </button>
      
      <nav className={styles.nav}>
        <div className={styles.mainNav}>
          <Link 
            to="/" 
            onClick={onMobileClose}
            className={isActiveRoute('/') ? styles.active : ''}
          >
            Today
          </Link>
          <Link 
            to="/upcoming" 
            onClick={onMobileClose}
            className={isActiveRoute('/upcoming') ? styles.active : ''}
          >
            Upcoming
          </Link>
        </div>

        <div className={styles.categories}>
          <h2 className={styles.categoryHeader}>Categories</h2>
          <ul className={styles.categoryList}>
            <li>
              <div className={styles.categoryWrapper}>
                <Link 
                  to="/category/kitchen"
                  className={`${styles.categoryButton} ${isActiveCategory('kitchen') ? styles.active : ''}`}
                  onClick={onMobileClose}
                >
                  <span className={styles.categoryIcon} style={{ backgroundColor: '#4A90E2' }} />
                  Kitchen
                </Link>
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
                <Link 
                  to="/category/living-room"
                  className={`${styles.categoryButton} ${isActiveCategory('living-room') ? styles.active : ''}`}
                  onClick={onMobileClose}
                >
                  <span className={styles.categoryIcon} style={{ backgroundColor: '#9B59B6' }} />
                  Living Room
                </Link>
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
                <Link 
                  to="/category/bathroom"
                  className={`${styles.categoryButton} ${isActiveCategory('bathroom') ? styles.active : ''}`}
                  onClick={onMobileClose}
                >
                  <span className={styles.categoryIcon} style={{ backgroundColor: '#2ECC71' }} />
                  Bathroom
                </Link>
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