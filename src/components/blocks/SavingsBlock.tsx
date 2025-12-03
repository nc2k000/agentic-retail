'use client'

import { useState } from 'react'
import { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'

interface SavingsSwap {
  original: CartItem
  replacement: CartItem
  savings: number
  reason?: string
}

interface SavingsBlockProps {
  data: {
    listTitle: string
    originalItems: CartItem[]
    swaps: SavingsSwap[]
    totalSavings: number
  }
  onSwap: (original: CartItem, replacement: CartItem) => void
  onAddToCart: (item: CartItem) => void
  onSwapAll?: (swaps: SavingsSwap[]) => void
}

export function SavingsBlock({ data, onSwap, onAddToCart, onSwapAll }: SavingsBlockProps) {
  const [swappedItems, setSwappedItems] = useState<Record<number, boolean>>({})

  // Minimum thresholds
  const MIN_ITEM_SAVINGS = 0.50
  const MIN_TOTAL_SAVINGS = 1.00

  // Filter meaningful swaps
  const meaningfulSwaps = data.swaps.filter(swap => swap.savings >= MIN_ITEM_SAVINGS)
  const totalMeaningfulSavings = meaningfulSwaps.reduce((sum, swap) => sum + swap.savings, 0)

  if (meaningfulSwaps.length === 0 || totalMeaningfulSavings < MIN_TOTAL_SAVINGS) {
    return null
  }

  const handleSwap = (index: number) => {
    if (swappedItems[index]) return
    
    const swap = meaningfulSwaps[index]
    onSwap(swap.original, swap.replacement)
    setSwappedItems(prev => ({ ...prev, [index]: true }))
  }

  const handleSwapAll = () => {
    const unswappedSwaps = meaningfulSwaps.filter((_, index) => !swappedItems[index])

    if (onSwapAll && unswappedSwaps.length > 0) {
      // Use the callback if provided
      onSwapAll(unswappedSwaps)
    } else {
      // Fall back to individual swaps
      meaningfulSwaps.forEach((swap, index) => {
        if (!swappedItems[index]) {
          onSwap(swap.original, swap.replacement)
          setSwappedItems(prev => ({ ...prev, [index]: true }))
        }
      })
    }
  }

  const remainingSavings = meaningfulSwaps.reduce(
    (sum, swap, i) => swappedItems[i] ? sum : sum + swap.savings, 
    0
  )

  return (
    <div className="mt-3 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2 border-b border-emerald-100 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <span className="text-base sm:text-lg flex-shrink-0">💰</span>
          <span className="font-medium text-emerald-800 text-sm sm:text-base truncate">Savings Found</span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] sm:text-xs text-emerald-600 whitespace-nowrap">Total savings</div>
          <div className="font-bold text-emerald-700 text-base sm:text-lg whitespace-nowrap">{formatPrice(totalMeaningfulSavings)}</div>
        </div>
      </div>

      {/* Swaps */}
      <div className="divide-y divide-emerald-100">
        {meaningfulSwaps.map((swap, index) => {
          const isSwapped = swappedItems[index]
          const savingsPercent = Math.round((swap.savings / swap.original.price) * 100)

          return (
            <div key={index} className={`p-2 sm:p-4 ${isSwapped ? 'bg-emerald-50/50 opacity-60' : ''}`}>
              <div className="flex items-stretch gap-1.5 sm:gap-3 min-w-0">
                {/* Original */}
                <div className={`flex-1 p-2 sm:p-3 rounded-lg border min-w-0 ${isSwapped ? 'bg-stone-100 border-stone-200' : 'bg-white border-stone-200'}`}>
                  <div className="text-[10px] sm:text-xs text-stone-400 mb-1">Current</div>
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-base sm:text-xl flex-shrink-0">{swap.original.image}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs sm:text-sm font-medium truncate ${isSwapped ? 'line-through text-stone-400' : ''}`}>
                        {swap.original.name}
                      </div>
                      <div className={`text-xs sm:text-sm font-semibold ${isSwapped ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                        {formatPrice(swap.original.price)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm sm:text-base">
                    →
                  </div>
                  <div className="mt-0.5 sm:mt-1 px-1 sm:px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold rounded whitespace-nowrap">
                    -{savingsPercent}%
                  </div>
                </div>

                {/* Replacement */}
                <div className={`flex-1 p-2 sm:p-3 rounded-lg border min-w-0 ${isSwapped ? 'bg-emerald-100 border-emerald-300' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="text-[10px] sm:text-xs text-emerald-600 mb-1">Swap to</div>
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-base sm:text-xl flex-shrink-0">{swap.replacement.image}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium truncate">{swap.replacement.name}</div>
                      <div className="text-xs sm:text-sm font-semibold text-emerald-700">
                        {formatPrice(swap.replacement.price)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings & Button */}
              <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-emerald-100 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-shrink">
                    <span className="text-xs sm:text-sm text-stone-400 line-through whitespace-nowrap">{formatPrice(swap.original.price)}</span>
                    <span className="text-stone-400 hidden xs:inline">→</span>
                    <span className="text-xs sm:text-sm font-semibold text-emerald-700 whitespace-nowrap">{formatPrice(swap.replacement.price)}</span>
                  </div>
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-500 text-white rounded text-[10px] sm:text-xs font-bold whitespace-nowrap flex-shrink-0">
                    ↓ {formatPrice(swap.savings)}
                  </span>
                  {swap.reason && (
                    <span className="text-xs text-stone-500 flex-shrink-0 hidden sm:inline" title={swap.reason}>
                      ?
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleSwap(index)}
                  disabled={isSwapped}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium flex-shrink-0 whitespace-nowrap ${
                    isSwapped
                      ? 'bg-stone-200 text-stone-400'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isSwapped ? '✓' : 'Swap'}
                  <span className="hidden xs:inline">{isSwapped ? ' Swapped' : ''}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      {remainingSavings > 0 && (
        <div className="px-3 sm:px-4 py-3 bg-emerald-100 border-t border-emerald-200">
          <button
            onClick={handleSwapAll}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm sm:text-base font-medium transition-colors"
          >
            <span className="hidden sm:inline">Swap All • Save {formatPrice(remainingSavings)}</span>
            <span className="sm:hidden">Swap All • {formatPrice(remainingSavings)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
