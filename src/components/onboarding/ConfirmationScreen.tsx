'use client'

interface ConfirmationScreenProps {
  onComplete: () => void
  isLoading: boolean
}

export function ConfirmationScreen({
  onComplete,
  isLoading,
}: ConfirmationScreenProps) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Profile created!
      </h1>
      <p className="text-xl text-gray-600 mb-4">
        You can always update this in Settings.
      </p>
      <p className="text-lg text-gray-500 mb-8">
        The AI will learn more about your preferences as you shop.
      </p>

      <button
        onClick={onComplete}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Saving...</span>
          </span>
        ) : (
          'Start Shopping'
        )}
      </button>
    </div>
  )
}
