'use client'

import { useState } from 'react'
import { Subscription, SubscriptionFrequency } from '@/types'

interface SubscriptionCardProps {
  subscription: Subscription
  onUpdate: (id: string, updates: { quantity?: number; frequency?: SubscriptionFrequency }) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
  onCancel: (id: string) => void
}

const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
  weekly: 'Every week',
  biweekly: 'Every 2 weeks',
  monthly: 'Every month',
}

export function SubscriptionCard({
  subscription,
  onUpdate,
  onPause,
  onResume,
  onCancel,
}: SubscriptionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [quantity, setQuantity] = useState(subscription.quantity)
  const [frequency, setFrequency] = useState(subscription.frequency)

  const handleSave = () => {
    onUpdate(subscription.id, { quantity, frequency })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setQuantity(subscription.quantity)
    setFrequency(subscription.frequency)
    setIsEditing(false)
  }

  const nextDeliveryDate = new Date(subscription.nextDelivery)
  const isPaused = subscription.status === 'paused'

  // Calculate savings
  const itemPrice = subscription.product.price * subscription.quantity
  const discountAmount = (itemPrice * subscription.discount) / 100
  const subscriptionPrice = itemPrice - discountAmount

  return (
    <div className="px-6 py-5 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="text-4xl flex-shrink-0">
          {subscription.product.image}
        </div>

        {/* Product Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-900 mb-1">
                {subscription.product.name}
              </h3>

              {!isEditing ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Quantity: <span className="font-medium">{subscription.quantity}</span>
                  </p>
                  <p>
                    Frequency: <span className="font-medium">{FREQUENCY_LABELS[subscription.frequency]}</span>
                  </p>
                  {!isPaused && (
                    <p>
                      Next delivery:{' '}
                      <span className="font-medium">
                        {nextDeliveryDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={e => setQuantity(parseInt(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={e => setFrequency(e.target.value as SubscriptionFrequency)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="weekly">Every week</option>
                      <option value="biweekly">Every 2 weeks</option>
                      <option value="monthly">Every month</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-gray-500 line-through">
                ${itemPrice.toFixed(2)}
              </div>
              <div className="text-lg font-bold text-green-600">
                ${subscriptionPrice.toFixed(2)}
              </div>
              <div className="text-xs text-green-600 font-medium">
                Save {subscription.discount}%
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
                {!isPaused ? (
                  <button
                    onClick={() => onPause(subscription.id)}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={() => onResume(subscription.id)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Resume
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel this subscription?')) {
                      onCancel(subscription.id)
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Paused Badge */}
          {isPaused && (
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⏸️ Paused
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
