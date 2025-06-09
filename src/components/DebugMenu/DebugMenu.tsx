import { useState, useRef, useEffect } from 'react'
import { useToast } from '../Toast/ToastProvider'
import { generateDummyData } from './dummyData'
import styles from './DebugMenu.module.scss'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
}

function ConfirmationModal({ isOpen, onClose, onConfirm, message }: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.confirmationOverlay}>
      <div className={styles.confirmationModal}>
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export function DebugMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    message: '',
    action: () => {},
  })
  const { showToast } = useToast()

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResetData = () => {
    setConfirmationState({
      isOpen: true,
      message: 'This will delete all your tasks, categories, and settings. Are you sure?',
      action: () => {
        localStorage.clear()
        showToast('All data has been reset', 'success')
        window.location.reload()
      },
    })
  }

  const handlePopulateDummyData = () => {
    setConfirmationState({
      isOpen: true,
      message: 'This will add sample tasks and categories. Continue?',
      action: () => {
        generateDummyData()
        showToast('Sample data has been added', 'success')
      },
    })
  }

  const handleRestartOnboarding = () => {
    setConfirmationState({
      isOpen: true,
      message: 'This will restart the onboarding process. Continue?',
      action: () => {
        localStorage.setItem('onboardingComplete', 'false')
        showToast('Onboarding has been reset', 'success')
        window.location.reload()
      },
    })
  }

  return (
    <>
      <div className={styles.debugMenuContainer} ref={menuRef}>
        <button 
          className={styles.debugTrigger}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle debug menu"
        >
          🛠️
        </button>
        {isOpen && (
          <div className={styles.debugMenu}>
            <div className={styles.debugButtons}>
              <button 
                onClick={handleRestartOnboarding}
                className={styles.debugButton}
                aria-label="Restart setup process"
              >
                🔄 Restart Setup
              </button>
              <button 
                onClick={handlePopulateDummyData}
                className={styles.debugButton}
                aria-label="Add test tasks and categories"
              >
                📝 Add Test Tasks
              </button>
              <button 
                onClick={handleResetData}
                className={`${styles.debugButton} ${styles.dangerButton}`}
                aria-label="Reset all app data"
              >
                🗑️ Reset App
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          confirmationState.action()
          setConfirmationState(prev => ({ ...prev, isOpen: false }))
        }}
        message={confirmationState.message}
      />
    </>
  )
} 