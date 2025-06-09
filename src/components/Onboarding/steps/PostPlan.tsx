import { useOnboarding } from '../../../store/OnboardingContext'

interface PostPlanProps {
  onBack: () => void
}

export function PostPlan({ onBack }: PostPlanProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">All set!</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your plan has been created. You can now start managing your tasks.
        </p>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-2 text-sm font-medium text-green-800">
            Setup completed successfully
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900">What's next?</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li>• Add your first task in any category</li>
            <li>• Set up recurring tasks for regular chores</li>
            <li>• Invite household members to collaborate</li>
            <li>• Customize task categories and settings</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
        >
          Back
        </button>
        <a
          href="/today"
          className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600"
        >
          Get Started
        </a>
      </div>
    </div>
  )
} 