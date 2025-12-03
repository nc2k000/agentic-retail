'use client'

import { OrderBlock as OrderBlockType } from '@/types'
import { formatPrice } from '@/lib/utils'

interface OrderBlockProps {
  data: OrderBlockType['data']
}

export function OrderBlock({ data }: OrderBlockProps) {
  return (
    <div className="mt-3 sm:mt-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl overflow-hidden w-full max-w-full">
      {/* Success Header */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 bg-white/80 border-b border-emerald-200 text-center">
        <div className="text-3xl sm:text-4xl mb-2">✅</div>
        <h3 className="text-lg sm:text-xl font-semibold text-emerald-800">Order Confirmed!</h3>
        <p className="text-xs sm:text-sm text-emerald-600 mt-1">
          Order #{data.orderNumber}
        </p>
      </div>

      {/* Order Summary */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Items Summary */}
        <div className="bg-white rounded-lg p-3 border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-700">
              {data.itemCount} {data.itemCount === 1 ? 'item' : 'items'}
            </span>
            <span className="text-lg font-bold text-stone-800">{formatPrice(data.total)}</span>
          </div>

          {/* Item List */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {data.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                <span>{item.image}</span>
                <span className="flex-1 truncate">{item.name}</span>
                <span className="text-xs">×{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery/Pickup Info */}
        {(data.estimatedDelivery || data.pickupReady) && (
          <div className="bg-white rounded-lg p-3 border border-emerald-100">
            <div className="flex items-start gap-2">
              <span className="text-xl">
                {data.estimatedDelivery ? '🚚' : '🏪'}
              </span>
              <div>
                <p className="text-sm font-medium text-stone-700">
                  {data.estimatedDelivery ? 'Estimated Delivery' : 'Ready for Pickup'}
                </p>
                <p className="text-sm text-stone-600 mt-0.5">
                  {data.estimatedDelivery || data.pickupReady}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>{data.status === 'confirmed' ? 'Confirmed' : 'Processing'}</span>
          </div>
        </div>

        {/* Thank You Message */}
        <p className="text-center text-sm text-stone-600">
          Thank you for shopping with us! 🎉
        </p>
      </div>
    </div>
  )
}
