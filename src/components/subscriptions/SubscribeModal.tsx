'use client'

import { useState } from 'react'
import { Product, SubscriptionFrequency } from '@/types'

interface SubscribeModalProps {
  product: Product
  quantity: number
  onSubscribe: (frequency: SubscriptionFrequency) => void
  onClose: () => void
}

const FREQUENCIES: { value: SubscriptionFrequency; label: string; description: string }[] = [
  {
    value: 'weekly',
    label: 'Every Week',
    description: 'Perfect for essentials you use daily',
  },
  {
    value: 'biweekly',
    label: 'Every 2 Weeks',
    description: 'Great for regular pantry items',
  },
  {
    value: 'monthly',
    label: 'Every Month',
    description: 'Ideal for bulk or long-lasting items',
  },
]

export function SubscribeModal({ product, quantity, onSubscribe, onClose }: SubscribeModalProps) {
  const [selectedFrequency, setSelectedFrequency] = useState<SubscriptionFrequency>('weekly')

  const originalPrice = product.price * quantity
  const discountAmount = originalPrice * 0.1
  const subscriptionPrice = originalPrice - discountAmount

  const handleSubscribe = () => {
    onSubscribe(selectedFrequency)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Subscribe & Save</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{product.image}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600">Quantity: {quantity}</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="px-6 py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Regular price:</span>
            <span className="text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Subscribe & Save (10%):</span>
            <span className="text-2xl font-bold text-green-700">${subscriptionPrice.toFixed(2)}</span>
          </div>
          <div className="text-sm text-green-600 font-medium">
            You save ${discountAmount.toFixed(2)} per delivery
          </div>
        </div>

        {/* Frequency Selection */}
        <div className="px-6 py-5">
          <h3 className="font-semibold text-gray-900 mb-3">Choose delivery frequency</h3>
          <div className="space-y-3">
            {FREQUENCIES.map(freq => (
              <button
                key={freq.value}
                onClick={() => setSelectedFrequency(freq.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedFrequency === freq.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{freq.label}</div>
                    <div className="text-sm text-gray-600">{freq.description}</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedFrequency === freq.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedFrequency === freq.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 text-sm">Benefits:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Save 10% on every delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Never run out of essentials</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Pause, skip, or cancel anytime</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Adjust quantity or frequency as needed</span>
            </li>
          </ul>

          <div className="mt-3 p-2.5 bg-white border border-blue-300 rounded-lg">
            <p className="text-xs text-gray-700 flex items-start gap-1.5">
              <span className="text-blue-600 mt-0.5">ℹ️</span>
              <span><strong>No payment now.</strong> Subscribed items are automatically added to your cart on delivery days. You'll only be charged when you checkout.</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubscribe}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  )
}
