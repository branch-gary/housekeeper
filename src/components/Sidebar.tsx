import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const [searchInputValue, setSearchInputValue] = useState('')
  const { searchQuery, setSearchQuery, categories, addCategory, tasks } = useTaskStore()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const newCategoryInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // Calculate task counts for each category
  const categoryTaskCounts = useMemo(() => {
    return categories.reduce((acc, category) => {
      const incompleteTasks = tasks.filter(task => 
        task && 
        task.category === category.id && 
        !task.isCompleted
      ).length
      acc[category.id] = incompleteTasks
      return acc
    }, {} as Record<string, number>)
  }, [categories, tasks])

  // Auto-focus the new category input when it appears
  useEffect(() => {
    if (isAddingCategory && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus()
    }
  }, [isAddingCategory])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const handlePlanClick = (categoryName: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent category click event
    setPlanningCategory(categoryName)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInputValue(value)

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set a new timeout for the debounced search
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value)
      if (value.trim()) {
        navigate('/search')
      }
    }, 300)
  }

  const handleSearchClear = () => {
    setSearchInputValue('')
    setSearchQuery('')
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
      <button 
        className={styles.addTask}
        onClick={() => setIsModalOpen(true)}
      >
        + Add Task
      </button>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInputValue}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {searchInputValue && (
          <button
            className={styles.clearSearch}
            onClick={handleSearchClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      
      <nav>
        <ul className={styles.nav}>
          <li>
            <Link 
              to="/"
              className={`${styles.navLink} ${isActiveRoute('/') ? styles.active : ''}`}
              onClick={onMobileClose}
            >
              Today
            </Link>
          </li>
          <li>
            <Link 
              to="/upcoming"
              className={`${styles.navLink} ${isActiveRoute('/upcoming') ? styles.active : ''}`}
              onClick={onMobileClose}
            >
              Upcoming
            </Link>
          </li>
        </ul>
      </nav>

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
                  <span className={styles.categoryName}>
                    {category.name}
                    {categoryTaskCounts[category.id] > 0 && (
                      <span className={styles.categoryBadge}>
                        ({categoryTaskCounts[category.id]})
                      </span>
                    )}
                  </span>
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
                  placeholder="Category name"
                  className={styles.addCategoryInput}
                />
                {addCategoryError && (
                  <p className={styles.error}>{addCategoryError}</p>
                )}
              </form>
            ) : (
              <button
                className={styles.addCategory}
                onClick={handleAddCategoryClick}
              >
                + Add Category
              </button>
            )}
          </li>
        </ul>
      </div>

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