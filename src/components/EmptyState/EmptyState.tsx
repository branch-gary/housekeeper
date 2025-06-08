import styles from './EmptyState.module.scss'

interface EmptyStateProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  icon?: string
}

export default function EmptyState({ 
  title, 
  message, 
  actionLabel, 
  onAction,
  icon
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className={styles.actionButton}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
} 