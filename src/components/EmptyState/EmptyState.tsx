import styles from './EmptyState.module.scss'

interface EmptyStateProps {
  title: string
  message: string
  actionLabel: string
  onAction: () => void
}

function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  console.log('EmptyState rendering:', { title, message, actionLabel })
  
  return (
    <div className={styles.emptyState}>
      <div className={styles.content}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button 
          className={styles.actionButton}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}

export default EmptyState 