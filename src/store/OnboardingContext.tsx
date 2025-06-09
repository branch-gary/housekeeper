import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from './TaskContext'

interface Room {
  id: string
  name: string
  description: string
  color: string
}

interface Person {
  id: string
  name: string
  type: string
  color: string
}

interface OnboardingState {
  step: number
  selectedRooms: string[]
  selectedPeople: string[]
  customNames: Record<string, string>
  isLivingAlone: boolean
  hasCompletedOnboarding: boolean
}

interface OnboardingContextType {
  state: OnboardingState
  setStep: (step: number) => void
  selectRoom: (roomId: string) => void
  unselectRoom: (roomId: string) => void
  selectPerson: (personId: string) => void
  unselectPerson: (personId: string) => void
  setCustomName: (id: string, name: string) => void
  setLivingAlone: (isAlone: boolean) => void
  completeOnboarding: () => Promise<void>
  resetOnboarding: () => void
  availableRooms: Room[]
  availablePeople: Person[]
}

const DEFAULT_ROOMS: Room[] = [
  { id: 'kitchen', name: 'Kitchen', description: 'Cooking and dining area', color: '#2563eb' },
  { id: 'living', name: 'Living Room', description: 'Main living space', color: '#16a34a' },
  { id: 'bedroom', name: 'Bedroom', description: 'Sleeping and rest area', color: '#9333ea' },
  { id: 'bathroom', name: 'Bathroom', description: 'Bathroom and hygiene', color: '#0891b2' },
  { id: 'office', name: 'Home Office', description: 'Work and study space', color: '#ea580c' },
  { id: 'outdoor', name: 'Outdoor', description: 'Garden, patio, or balcony', color: '#65a30d' }
]

const DEFAULT_PEOPLE: Person[] = [
  { id: 'partner', name: 'Partner', type: 'Person', color: '#2563eb' },
  { id: 'roommate', name: 'Roommate', type: 'Person', color: '#16a34a' },
  { id: 'child', name: 'Child', type: 'Person', color: '#9333ea' },
  { id: 'dog', name: 'Dog', type: 'Pet', color: '#0891b2' },
  { id: 'cat', name: 'Cat', type: 'Pet', color: '#ea580c' }
]

const STORAGE_KEY = 'housekeeper-onboarding'

const defaultState: OnboardingState = {
  step: 1,
  selectedRooms: [],
  selectedPeople: [],
  customNames: {},
  isLivingAlone: false,
  hasCompletedOnboarding: false
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultState
    } catch (error) {
      console.error('Error loading onboarding state:', error)
      return defaultState
    }
  })

  const { addCategory } = useTaskStore()
  const navigate = useNavigate()

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Error saving onboarding state:', error)
    }
  }, [state])

  const setStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, step }))
  }, [])

  const selectRoom = useCallback((roomId: string) => {
    setState(prev => ({
      ...prev,
      selectedRooms: [...prev.selectedRooms, roomId]
    }))
  }, [])

  const unselectRoom = useCallback((roomId: string) => {
    setState(prev => ({
      ...prev,
      selectedRooms: prev.selectedRooms.filter(id => id !== roomId)
    }))
  }, [])

  const selectPerson = useCallback((personId: string) => {
    setState(prev => ({
      ...prev,
      selectedPeople: [...prev.selectedPeople, personId]
    }))
  }, [])

  const unselectPerson = useCallback((personId: string) => {
    setState(prev => {
      const { [personId]: _, ...remainingNames } = prev.customNames
      return {
        ...prev,
        selectedPeople: prev.selectedPeople.filter(id => id !== personId),
        customNames: remainingNames
      }
    })
  }, [])

  const setCustomName = useCallback((id: string, name: string) => {
    setState(prev => ({
      ...prev,
      customNames: {
        ...prev.customNames,
        [id]: name
      }
    }))
  }, [])

  const setLivingAlone = useCallback((isAlone: boolean) => {
    setState(prev => ({
      ...prev,
      isLivingAlone: isAlone,
      selectedPeople: isAlone ? [] : prev.selectedPeople,
      customNames: isAlone ? {} : prev.customNames
    }))
  }, [])

  const completeOnboarding = useCallback(async () => {
    try {
      // Create categories for selected rooms
      for (const roomId of state.selectedRooms) {
        const room = DEFAULT_ROOMS.find(r => r.id === roomId)
        if (room) {
          await addCategory(room.name)
        }
      }

      // Create categories for selected people/pets
      for (const personId of state.selectedPeople) {
        const person = DEFAULT_PEOPLE.find(p => p.id === personId)
        if (person) {
          const name = state.customNames[personId] || person.name
          await addCategory(name)
        }
      }

      setState(prev => ({
        ...prev,
        hasCompletedOnboarding: true
      }))

      navigate('/today')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw new Error('Failed to complete onboarding setup')
    }
  }, [state.selectedRooms, state.selectedPeople, state.customNames, addCategory, navigate])

  const resetOnboarding = useCallback(() => {
    setState(defaultState)
  }, [])

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setStep,
        selectRoom,
        unselectRoom,
        selectPerson,
        unselectPerson,
        setCustomName,
        setLivingAlone,
        completeOnboarding,
        resetOnboarding,
        availableRooms: DEFAULT_ROOMS,
        availablePeople: DEFAULT_PEOPLE
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
} 