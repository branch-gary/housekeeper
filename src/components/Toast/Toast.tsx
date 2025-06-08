import { useEffect } from 'react'
import styles from './Toast.module.scss'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div 
      className={`${styles.toast} ${styles[type]}`}
      role="alert"
      aria-live="polite"
    >
      {message}
      <button 
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

export default Toast 