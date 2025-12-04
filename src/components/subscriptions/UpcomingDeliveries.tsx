'use client'

import { Subscription } from '@/types'

interface UpcomingDeliveriesProps {
  deliveries: Subscription[]
}

export function UpcomingDeliveries({ deliveries }: UpcomingDeliveriesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Upcoming Deliveries
      </h2>

      <div className="space-y-3">
        {deliveries.map(sub => {
          const deliveryDate = new Date(sub.nextDelivery)
          const isToday = deliveryDate.toDateString() === new Date().toDateString()
          const isTomorrow = deliveryDate.toDateString() === new Date(Date.now() + 86400000).toDateString()

          let dateLabel = deliveryDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })

          if (isToday) dateLabel = 'Today'
          else if (isTomorrow) dateLabel = 'Tomorrow'

          return (
            <div
              key={sub.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sub.product.image}</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {sub.product.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Qty: {sub.quantity}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-semibold ${
                    isToday ? 'text-green-600' : 'text-gray-900'
                  }`}
                >
                  {dateLabel}
                </div>
                {isToday && (
                  <div className="text-xs text-green-600">
                    Adding to cart...
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
