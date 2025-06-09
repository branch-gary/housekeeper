import { useOnboarding } from '../../../store/OnboardingContext'
import styles from './PeopleSelection.module.scss'

interface PeopleSelectionProps {
  onNext: () => void
  onBack: () => void
}

export function PeopleSelection({ onNext, onBack }: PeopleSelectionProps) {
  const { state, setLivingAlone, selectPerson, unselectPerson, availablePeople } = useOnboarding()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Who else shares this space with you?
        </h1>
        <p className={styles.subtitle}>
          This helps us organize tasks that involve others.
        </p>
      </div>

      <div className={styles.livingAlone}>
        <button
          className={`${styles.aloneButton} ${state.isLivingAlone ? styles.selected : ''}`}
          onClick={() => setLivingAlone(!state.isLivingAlone)}
          aria-pressed={state.isLivingAlone}
        >
          🏠 I live alone
        </button>
      </div>

      {!state.isLivingAlone && (
        <div className={styles.grid}>
          {availablePeople.map(person => {
            const isSelected = state.selectedPeople.includes(person.id)
            return (
              <button
                key={person.id}
                onClick={() => isSelected ? unselectPerson(person.id) : selectPerson(person.id)}
                className={`${styles.personButton} ${isSelected ? styles.selected : ''}`}
                aria-pressed={isSelected}
              >
                <div className={styles.personIcon} style={{ backgroundColor: person.color }}>
                  {getPersonEmoji(person.type)}
                </div>
                <div className={styles.personInfo}>
                  <div className={styles.personName}>{person.name}</div>
                  <div className={styles.personType}>{person.type}</div>
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
      )}

      <div className={styles.footer}>
        <button onClick={onBack} className={styles.backButton}>
          Back
        </button>
        <button
          onClick={onNext}
          className={styles.nextButton}
        >
          Next
        </button>
      </div>
    </div>
  )
}

function getPersonEmoji(type: string): string {
  return type === 'Pet' ? '🐾' : '👤'
} 