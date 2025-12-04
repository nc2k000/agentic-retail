'use client'

import { User } from '@supabase/supabase-js'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { SubscriptionCard } from './SubscriptionCard'
import { UpcomingDeliveries } from './UpcomingDeliveries'
import { SavingsSummary } from './SavingsSummary'
import { AutoCartSimulation } from './AutoCartSimulation'
import Link from 'next/link'

interface SubscriptionsViewProps {
  user: User
  profile: any
}

export function SubscriptionsView({ user, profile }: SubscriptionsViewProps) {
  const {
    subscriptions,
    allSubscriptions,
    upcomingDeliveries,
    monthlySavings,
    isLoading,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
  } = useSubscriptions(user.id)

  // Separate active and paused subscriptions
  const activeSubscriptions = allSubscriptions.filter(sub => sub.status === 'active')
  const pausedSubscriptions = allSubscriptions.filter(sub => sub.status === 'paused')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading subscriptions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
              <p className="text-gray-600 mt-1">Manage your auto-delivery items</p>
            </div>
            <Link
              href="/chat"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              ← Back to Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Savings Summary */}
        <SavingsSummary
          monthlySavings={monthlySavings}
          activeCount={subscriptions.length}
        />

        {/* Auto-Cart Simulation */}
        <AutoCartSimulation subscriptions={subscriptions} />

        {/* Upcoming Deliveries */}
        {upcomingDeliveries.length > 0 && (
          <div className="mb-8">
            <UpcomingDeliveries deliveries={upcomingDeliveries} />
          </div>
        )}

        {/* Active Subscriptions List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Subscriptions ({activeSubscriptions.length})
            </h2>
          </div>

          {activeSubscriptions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-5xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active subscriptions
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to your favorite items and save 10% on every delivery
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeSubscriptions.map(subscription => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onUpdate={updateSubscription}
                  onPause={pauseSubscription}
                  onResume={resumeSubscription}
                  onCancel={cancelSubscription}
                />
              ))}
            </div>
          )}
        </div>

        {/* Paused Subscriptions List */}
        {pausedSubscriptions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-amber-50">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏸️</span>
                <h2 className="text-xl font-semibold text-gray-900">
                  Paused Subscriptions ({pausedSubscriptions.length})
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                These subscriptions are paused and won't be delivered. Resume them anytime.
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {pausedSubscriptions.map(subscription => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onUpdate={updateSubscription}
                  onPause={pauseSubscription}
                  onResume={resumeSubscription}
                  onCancel={cancelSubscription}
                />
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💡</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                How Subscriptions Work
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Items are automatically added to your cart on delivery day</li>
                <li>• Save 10% on all subscription orders</li>
                <li>• Pause or cancel anytime with no commitment</li>
                <li>• Adjust quantities and frequency as needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
