import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '../store/TaskContext'
import { TaskSection } from '../components/TaskSection/TaskSection'
import EmptyState from '../components/EmptyState/EmptyState'
import styles from './SearchResults.module.scss'

export function SearchResults() {
  const { tasks, categories, searchQuery, setSearchQuery } = useTaskStore()
  const navigate = useNavigate()

  // If there's no search query, redirect to home
  useEffect(() => {
    if (!searchQuery.trim()) {
      navigate('/')
    }
  }, [searchQuery, navigate])

  // Group tasks by category
  const tasksByCategory = categories.map(category => ({
    category,
    tasks: tasks.filter(task => 
      task && // Check if task exists
      task.name && // Check if task has a name
      task.category === category.id && 
      task.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    )
  })).filter(group => group.tasks.length > 0)

  // Get tasks without a category
  const uncategorizedTasks = tasks.filter(task => 
    task && // Check if task exists
    task.name && // Check if task has a name
    !task.category && 
    task.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const totalResults = tasksByCategory.reduce(
    (sum, group) => sum + group.tasks.length, 
    uncategorizedTasks.length
  )

  const handleClearSearch = () => {
    setSearchQuery('')
    navigate('/')
  }

  if (!searchQuery.trim()) {
    return null
  }

  return (
    <div className={styles.searchResults}>
      <header className={styles.header}>
        <h1>Search Results</h1>
        <button 
          className={styles.clearButton}
          onClick={handleClearSearch}
        >
          Back to Tasks
        </button>
      </header>

      {totalResults === 0 ? (
        <div className={styles.emptyStateWrapper}>
          <EmptyState
            title="🕵️‍♀️ Couldn't find anything"
            message="Try a different word? Sometimes the simplest search works best."
            actionLabel="Clear Search"
            onAction={handleClearSearch}
          />
        </div>
      ) : (
        <>
          <p className={styles.resultCount}>
            Found {totalResults} {totalResults === 1 ? 'task' : 'tasks'}
          </p>
          
          {/* Categorized tasks */}
          {tasksByCategory.map(({ category, tasks }) => (
            <TaskSection
              key={category.id}
              title={category.name}
              tasks={tasks}
              viewId={`search-${category.id}`}
              showEmptyState={false}
            />
          ))}

          {/* Uncategorized tasks */}
          {uncategorizedTasks.length > 0 && (
            <TaskSection
              title="Other Tasks"
              tasks={uncategorizedTasks}
              viewId="search-uncategorized"
              showEmptyState={false}
            />
          )}
        </>
      )}
    </div>
  )
} 