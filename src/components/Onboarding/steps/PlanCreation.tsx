import { useOnboarding } from '../../../store/OnboardingContext'

interface PlanCreationProps {
  onNext: () => void
  onBack: () => void
}

export function PlanCreation({ onNext, onBack }: PlanCreationProps) {
  const { state, completeOnboarding, availableRooms, availablePeople } = useOnboarding()

  const handleNext = async () => {
    try {
      await completeOnboarding()
      onNext()
    } catch (error) {
      // Error will be handled by the toast in the parent component
      console.error('Failed to complete onboarding:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Create your plan</h2>
        <p className="mt-1 text-sm text-gray-500">
          We'll create categories for your tasks based on your selections.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900">Selected rooms</h3>
          <ul className="mt-2 space-y-1">
            {state.selectedRooms.map(roomId => {
              const room = availableRooms.find(r => r.id === roomId)
              return room ? (
                <li key={room.id} className="text-gray-600">
                  {room.name}
                </li>
              ) : null
            })}
          </ul>
        </div>

        {!state.isLivingAlone && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Household members</h3>
            <ul className="mt-2 space-y-1">
              {state.selectedPeople.map(personId => {
                const person = availablePeople.find(p => p.id === personId)
                return person ? (
                  <li key={person.id} className="text-gray-600">
                    {state.customNames[person.id] || person.name} ({person.type})
                  </li>
                ) : null
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600"
        >
          Create Plan
        </button>
      </div>
    </div>
  )
} 