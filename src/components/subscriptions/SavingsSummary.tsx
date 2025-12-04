'use client'

interface SavingsSummaryProps {
  monthlySavings: number
  activeCount: number
}

export function SavingsSummary({ monthlySavings, activeCount }: SavingsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Active Subscriptions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">
              Active Subscriptions
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {activeCount}
            </p>
          </div>
          <div className="text-4xl">📦</div>
        </div>
      </div>

      {/* Monthly Savings */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-800 font-medium">
              Monthly Savings
            </p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              ${monthlySavings.toFixed(2)}
            </p>
            <p className="text-xs text-green-700 mt-1">
              10% off all subscription items
            </p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      {/* Yearly Projection */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Yearly Savings
            </p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              ${(monthlySavings * 12).toFixed(2)}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Projected annual savings
            </p>
          </div>
          <div className="text-4xl">📈</div>
        </div>
      </div>
    </div>
  )
}
