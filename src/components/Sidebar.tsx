import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AddTaskModal from './AddTaskModal/AddTaskModal'
import AddPlanModal from './AddPlanModal/AddPlanModal'
import { useTaskStore } from '../store/TaskContext'
import { useToast } from './Toast/ToastProvider'
import styles from './Sidebar.module.scss'

interface SidebarProps {
  onMobileClose?: () => void
}

const Sidebar = ({ onMobileClose }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [planningCategory, setPlanningCategory] = useState<string | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [addCategoryError, setAddCategoryError] = useState<string | null>(null)
  const { searchQuery, setSearchQuery, categories, addCategory } = useTaskStore()
  const { showToast } = useToast()
  const location = useLocation()
  const newCategoryInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the new category input when it appears
  useEffect(() => {
    if (isAddingCategory && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus()
    }
  }, [isAddingCategory])

  const handlePlanClick = (categoryName: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent category click event
    setPlanningCategory(categoryName)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleAddCategoryClick = () => {
    setIsAddingCategory(true)
    setAddCategoryError(null)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await addCategory(newCategoryName)
    if (result.success) {
      setNewCategoryName('')
      setIsAddingCategory(false)
      setAddCategoryError(null)
      showToast('Category added successfully!', 'success')
    } else {
      setAddCategoryError(result.error || 'Failed to add category')
      showToast(result.error || 'Failed to add category', 'error')
    }
  }

  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAddingCategory(false)
      setNewCategoryName('')
      setAddCategoryError(null)
    }
  }

  const handleTasksAdded = (tasks: string[]) => {
    // Remove duplicate toast since AddPlanModal already shows one
    // showToast(`Added ${tasks.length} tasks successfully!`, 'success')
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  const isActiveCategory = (categoryName: string) => {
    return location.pathname === `/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`
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

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tasks…"
            aria-label="Search tasks"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className={styles.categories}>
          <h2 className={styles.categoryHeader}>Categories</h2>
          <ul className={styles.categoryList}>
            {categories.map(category => (
              <li key={category.id}>
                <div className={styles.categoryWrapper}>
                  <Link 
                    to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`${styles.categoryButton} ${isActiveCategory(category.name) ? styles.active : ''}`}
                    onClick={onMobileClose}
                  >
                    <span 
                      className={styles.categoryIcon} 
                      style={{ backgroundColor: category.color }} 
                    />
                    {category.name}
                  </Link>
                  <button 
                    className={styles.planButton}
                    onClick={(e) => handlePlanClick(category.name, e)}
                    aria-label={`Plan tasks for ${category.name}`}
                  >
                    Plan
                  </button>
                </div>
              </li>
            ))}

            {/* Add Category Form */}
            <li>
              {isAddingCategory ? (
                <form onSubmit={handleCategorySubmit} className={styles.addCategoryForm}>
                  <input
                    ref={newCategoryInputRef}
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={handleCategoryKeyDown}
                    placeholder="Category name..."
                    className={styles.addCategoryInput}
                    aria-label="New category name"
                  />
                  {addCategoryError && (
                    <div className={styles.addCategoryError}>
                      {addCategoryError}
                    </div>
                  )}
                  <div className={styles.addCategoryActions}>
                    <button 
                      type="submit" 
                      className={styles.addCategorySubmit}
                      disabled={!newCategoryName.trim()}
                    >
                      Add
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false)
                        setNewCategoryName('')
                        setAddCategoryError(null)
                      }}
                      className={styles.addCategoryCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={handleAddCategoryClick}
                  className={styles.addCategoryButton}
                >
                  + Add Category
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {planningCategory && (
        <AddPlanModal
          categoryName={planningCategory}
          onClose={() => setPlanningCategory(null)}
          onTasksAdded={handleTasksAdded}
        />
      )}
    </aside>
  )
}

export default Sidebar 