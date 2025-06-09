import { useOnboarding } from '../../../store/OnboardingContext'

interface CategorySelectionProps {
  onNext: () => void
  onBack: () => void
}

export function CategorySelection({ onNext, onBack }: CategorySelectionProps) {
  const { state, setCustomName, availablePeople } = useOnboarding()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Customize names</h2>
        <p className="mt-1 text-sm text-gray-500">
          Optionally customize the names for your household members.
        </p>
      </div>

      <div className="space-y-4">
        {state.selectedPeople.map(personId => {
          const person = availablePeople.find(p => p.id === personId)
          if (!person) return null

          return (
            <div key={person.id} className="space-y-2">
              <label htmlFor={person.id} className="block text-sm font-medium text-gray-700">
                {person.name} ({person.type})
              </label>
              <input
                type="text"
                id={person.id}
                value={state.customNames[person.id] || ''}
                onChange={e => setCustomName(person.id, e.target.value)}
                placeholder={`Custom name for ${person.name}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  )
} 