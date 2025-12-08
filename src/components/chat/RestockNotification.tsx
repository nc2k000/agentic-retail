'use client'

import { useEffect, useState } from 'react'
import { RestockItem } from '@/lib/patterns/restock'
import type { Mission } from '@/types'

interface RestockNotificationProps {
  userId: string
  onStartShopping: (message: string) => void
  activeMission?: Mission | null
}

export function RestockNotification({ userId, onStartShopping, activeMission }: RestockNotificationProps) {
  const [urgentItems, setUrgentItems] = useState<RestockItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  // Check if active mission is a decision tree mission
  const isTreeMission = activeMission?.treeId !== undefined && activeMission?.treeId !== null

  useEffect(() => {
    // Don't fetch restock data during tree missions
    if (isTreeMission) {
      setIsLoading(false)
      return
    }

    async function fetchRestockSuggestions() {
      try {
        const response = await fetch('/api/restock?urgentOnly=true')
        const data = await response.json()

        if (data.items && data.items.length > 0) {
          setUrgentItems(data.items)
        }
      } catch (error) {
        console.error('Failed to fetch restock suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestockSuggestions()
  }, [userId, isTreeMission])

  // Don't show if loading, dismissed, no urgent items, or tree mission active
  if (isLoading || isDismissed || urgentItems.length === 0 || isTreeMission) {
    return null
  }

  // Separate overdue (red) and order soon (yellow) items
  const overdueItems = urgentItems.filter(item => item.restockUrgency === 'order_now' && item.daysUntilSuggestedOrder <= 0)
  const orderSoonItems = urgentItems.filter(item =>
    item.restockUrgency === 'order_now' || item.restockUrgency === 'order_soon'
  )

  // Top 3 items to display
  const displayItems = urgentItems.slice(0, 3)

  // Determine urgency level and messaging
  const hasOverdue = overdueItems.length > 0
  const urgencyColor = hasOverdue ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
  const iconColor = hasOverdue ? 'text-red-600' : 'text-yellow-600'
  const icon = hasOverdue ? '🔴' : '🟡'

  // Get first item name for personalized messaging
  const firstItemName = displayItems[0]?.name || 'items'
  const itemCount = urgentItems.length

  const title = hasOverdue
    ? `Running out of ${firstItemName}${itemCount > 1 ? ` and ${itemCount - 1} more` : ''}?`
    : `Don't run out of ${firstItemName}${itemCount > 1 ? ` and ${itemCount - 1} more` : ''}!`

  const subtitle = hasOverdue
    ? 'Subscribe and never forget!'
    : 'Order now!'

  const handleStartShopping = () => {
    const itemNames = displayItems.map(item => item.name).join(', ')
    onStartShopping(`I need to restock: ${itemNames}`)
    setIsDismissed(true)
  }

  const handleSetupSubscriptions = () => {
    const itemNames = displayItems.map(item => item.name).join(', ')
    onStartShopping(`Help me set up subscriptions for: ${itemNames}`)
    setIsDismissed(true)
  }

  return (
    <div className={`mx-4 mt-4 mb-2 ${urgencyColor} border rounded-lg p-4 shadow-sm`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className={`text-2xl ${iconColor} flex-shrink-0 mt-0.5`}>
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-900 text-sm mb-1">
              {title}
            </h3>
            <p className="text-stone-600 text-xs mb-3">
              {subtitle}
            </p>

            {/* Item list */}
            <div className="flex flex-wrap gap-2 mb-3">
              {displayItems.map((item, index) => (
                <div
                  key={item.sku}
                  className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs border border-stone-200"
                >
                  <span className="text-base">{item.image}</span>
                  <span className="font-medium text-stone-700">{item.name}</span>
                  <span className="text-stone-500">${item.price.toFixed(2)}</span>
                </div>
              ))}
              {urgentItems.length > 3 && (
                <div className="inline-flex items-center gap-1.5 bg-stone-100 rounded-full px-3 py-1.5 text-xs text-stone-600">
                  +{urgentItems.length - 3} more
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {hasOverdue ? (
                <>
                  <button
                    onClick={handleSetupSubscriptions}
                    className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>📦</span>
                    <span>Set up subscriptions</span>
                  </button>
                  <button
                    onClick={handleStartShopping}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-300 transition-colors"
                  >
                    <span>🛒</span>
                    <span>Order now</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartShopping}
                    className="inline-flex items-center gap-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>🛒</span>
                    <span>Start shopping</span>
                  </button>
                  <button
                    onClick={handleSetupSubscriptions}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-300 transition-colors"
                  >
                    <span>📦</span>
                    <span>Set up subscriptions</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors p-1"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
