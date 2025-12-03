'use client'

interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">👋</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Agentic Retail!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Let's personalize your shopping experience.
        <br />
        This will take about 2 minutes.
      </p>
      <button
        onClick={onNext}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
      >
        Get Started
      </button>
    </div>
  )
}
