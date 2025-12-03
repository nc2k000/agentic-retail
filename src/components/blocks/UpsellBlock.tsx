'use client'

import { UpsellBlock as UpsellBlockType, CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'

interface UpsellBlockProps {
  data: UpsellBlockType['data']
  onAddToCart: (item: CartItem) => void
}

export function UpsellBlock({ data, onAddToCart }: UpsellBlockProps) {
  return (
    <div className="mt-3 sm:mt-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="px-3 sm:px-4 py-3 bg-white/80 border-b border-purple-200">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base sm:text-xl flex-shrink-0">💡</span>
          <h3 className="font-semibold text-purple-800 text-sm sm:text-base truncate">You might also like</h3>
        </div>
        {data.inference && (
          <p className="text-xs sm:text-sm text-purple-600 mt-1">{data.inference}</p>
        )}
      </div>

      {/* Complementary Items */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {data.complementary.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 transition-colors min-w-0"
          >
            <span className="text-xl sm:text-2xl flex-shrink-0">{item.image}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-stone-800 truncate">{item.name}</p>
              <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">{formatPrice(item.price)}</p>
              {item.reason && (
                <p className="text-[10px] sm:text-xs text-purple-600 mt-1 truncate">{item.reason}</p>
              )}
            </div>
            <button
              onClick={() => onAddToCart({
                ...item,
                quantity: 1,
                source: 'upsell'
              })}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Optional Action Chips */}
      {data.options && data.options.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {data.options.map((option, i) => (
              <button
                key={i}
                className="px-3 py-1.5 bg-white border border-purple-200 text-purple-700 text-sm rounded-full hover:bg-purple-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
