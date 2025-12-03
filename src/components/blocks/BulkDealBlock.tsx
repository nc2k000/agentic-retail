'use client'

import { CartItem, BulkDeal } from '@/types'
import { formatPrice } from '@/lib/utils'

interface BulkDealOpportunity {
  item: CartItem
  bulkDeal: BulkDeal
  additionalQty: number
  totalSavings: number
  message: string
}

interface BulkDealBlockProps {
  data: {
    opportunities: BulkDealOpportunity[]
    totalPotentialSavings: number
  }
  onAddQuantity: (sku: string, additionalQty: number) => void
}

export function BulkDealBlock({ data, onAddQuantity }: BulkDealBlockProps) {
  // Don't show if no opportunities
  if (!data.opportunities || data.opportunities.length === 0) {
    return null
  }

  return (
    <div className="mt-3 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2 border-b border-amber-100 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <span className="text-base sm:text-lg flex-shrink-0">🎯</span>
          <span className="font-medium text-amber-800 text-sm sm:text-base truncate">Bulk Deal Opportunities</span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] sm:text-xs text-amber-600 whitespace-nowrap">Save up to</div>
          <div className="font-bold text-amber-700 text-base sm:text-lg whitespace-nowrap">{formatPrice(data.totalPotentialSavings)}</div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="divide-y divide-amber-100">
        {data.opportunities.map((opp, index) => {
          const newTotal = opp.bulkDeal.price
          const oldTotal = opp.item.price * opp.bulkDeal.qty
          const savingsPercent = Math.round((opp.totalSavings / oldTotal) * 100)

          return (
            <div key={index} className="p-2 sm:p-4">
              {/* Product Info */}
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 min-w-0">
                <span className="text-xl sm:text-2xl flex-shrink-0">{opp.item.image}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-stone-800 truncate">{opp.item.name}</h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">
                    Currently: {opp.item.quantity} in cart
                  </p>
                </div>
              </div>

              {/* Deal Details */}
              <div className="flex items-stretch gap-2 sm:gap-3 min-w-0 mb-2 sm:mb-3">
                {/* Current */}
                <div className="flex-1 p-2 sm:p-3 bg-white rounded-lg border border-stone-200 min-w-0">
                  <div className="text-[10px] sm:text-xs text-stone-400 mb-1">Current price</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-700">
                    {formatPrice(opp.item.price)} each
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-stone-400 mt-0.5">
                    {opp.bulkDeal.qty} × {formatPrice(opp.item.price)} = {formatPrice(oldTotal)}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm sm:text-base">
                    →
                  </div>
                  <div className="mt-0.5 sm:mt-1 px-1 sm:px-1.5 py-0.5 bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold rounded whitespace-nowrap">
                    -{savingsPercent}%
                  </div>
                </div>

                {/* Bulk Deal */}
                <div className="flex-1 p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-200 min-w-0">
                  <div className="text-[10px] sm:text-xs text-amber-600 mb-1">Bulk deal</div>
                  <div className="text-xs sm:text-sm font-semibold text-amber-700">
                    {formatPrice(opp.bulkDeal.price)} for {opp.bulkDeal.qty}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-amber-600 mt-0.5">
                    Save {formatPrice(opp.totalSavings)}
                  </div>
                </div>
              </div>

              {/* Message & Action */}
              <div className="flex items-center justify-between gap-2 pt-2 sm:pt-3 border-t border-amber-100 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-stone-600 truncate">
                    💡 {opp.message}
                  </p>
                </div>
                <button
                  onClick={() => onAddQuantity(opp.item.sku, opp.additionalQty)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Add +{opp.additionalQty}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="px-3 sm:px-4 py-2 bg-amber-50 border-t border-amber-200">
        <p className="text-[10px] sm:text-xs text-amber-700 text-center">
          ℹ️ Bulk deals automatically apply when you reach the required quantity
        </p>
      </div>
    </div>
  )
}
