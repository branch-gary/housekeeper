import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../store/OnboardingContext'
import { useToast } from '../Toast/ToastProvider'
import { RoomSelection } from './steps/RoomSelection'
import { PeopleSelection } from './steps/PeopleSelection'
import styles from './Onboarding.module.scss'

export default function Onboarding() {
  const { state, setStep, completeOnboarding } = useOnboarding()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Reset to step 1 when component mounts
  useEffect(() => {
    setStep(1)
  }, [setStep])

  // Redirect to Today view if onboarding is complete
  useEffect(() => {
    if (state.hasCompletedOnboarding) {
      navigate('/today')
    }
  }, [state.hasCompletedOnboarding, navigate])

  const handleNext = async () => {
    try {
      setIsLoading(true)
      if (state.step === 2) {
        // Complete onboarding after the last step
        await completeOnboarding()
      } else {
        setStep(state.step + 1)
      }
    } catch (error) {
      showToast('Failed to proceed to next step. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (state.step > 1) {
      setStep(state.step - 1)
    }
  }

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <RoomSelection onNext={handleNext} />
      case 2:
        return <PeopleSelection onNext={handleNext} onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.progress}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${(state.step / 2) * 100}%` }}
          />
        </div>
        <div className={styles.step}>
          Step {state.step} of 2
        </div>
        {renderStep()}
      </div>
    </div>
  )
} 