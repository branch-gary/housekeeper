import { useOnboarding } from '../../../store/OnboardingContext'
import styles from './RoomSelection.module.scss'

interface RoomSelectionProps {
  onNext: () => void
}

export function RoomSelection({ onNext }: RoomSelectionProps) {
  const { state, selectRoom, unselectRoom, availableRooms } = useOnboarding()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Let's start by picking the areas of your home you want to keep on top of.
        </h1>
        <p className={styles.subtitle}>
          Don't worry — you can always add more later.
        </p>
      </div>

      <div className={styles.grid}>
        {availableRooms.map(room => {
          const isSelected = state.selectedRooms.includes(room.id)
          return (
            <button
              key={room.id}
              onClick={() => isSelected ? unselectRoom(room.id) : selectRoom(room.id)}
              className={`${styles.roomButton} ${isSelected ? styles.selected : ''}`}
              aria-pressed={isSelected}
            >
              <div className={styles.roomIcon} style={{ backgroundColor: room.color }}>
                {getRoomEmoji(room.id)}
              </div>
              <div className={styles.roomInfo}>
                <div className={styles.roomName}>{room.name}</div>
                <div className={styles.roomDescription}>{room.description}</div>
              </div>
              <div className={styles.checkmark}>
                {isSelected && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className={styles.footer}>
        <button
          onClick={onNext}
          disabled={state.selectedRooms.length === 0}
          className={styles.nextButton}
        >
          Next
        </button>
      </div>
    </div>
  )
}

function getRoomEmoji(roomId: string): string {
  const emojiMap: Record<string, string> = {
    kitchen: '🍳',
    living: '🛋️',
    bedroom: '🛏️',
    bathroom: '🚿',
    office: '💻',
    outdoor: '🌿'
  }
  return emojiMap[roomId] || '🏠'
} 