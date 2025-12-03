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
    <div className="mt-3 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <span className="font-medium text-emerald-800">Savings Found</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-emerald-600">Total savings</div>
          <div className="font-bold text-emerald-700 text-lg">{formatPrice(totalMeaningfulSavings)}</div>
        </div>
      </div>

      {/* Swaps */}
      <div className="divide-y divide-emerald-100">
        {meaningfulSwaps.map((swap, index) => {
          const isSwapped = swappedItems[index]
          const savingsPercent = Math.round((swap.savings / swap.original.price) * 100)

          return (
            <div key={index} className={`p-4 ${isSwapped ? 'bg-emerald-50/50 opacity-60' : ''}`}>
              <div className="flex items-stretch gap-3">
                {/* Original */}
                <div className={`flex-1 p-3 rounded-lg border ${isSwapped ? 'bg-stone-100 border-stone-200' : 'bg-white border-stone-200'}`}>
                  <div className="text-xs text-stone-400 mb-1">Current</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{swap.original.image}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${isSwapped ? 'line-through text-stone-400' : ''}`}>
                        {swap.original.name}
                      </div>
                      <div className={`text-sm font-semibold ${isSwapped ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                        {formatPrice(swap.original.price)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    →
                  </div>
                  <div className="mt-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">
                    -{savingsPercent}%
                  </div>
                </div>

                {/* Replacement */}
                <div className={`flex-1 p-3 rounded-lg border ${isSwapped ? 'bg-emerald-100 border-emerald-300' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="text-xs text-emerald-600 mb-1">Swap to</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{swap.replacement.image}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{swap.replacement.name}</div>
                      <div className="text-sm font-semibold text-emerald-700">
                        {formatPrice(swap.replacement.price)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings & Button */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-stone-400 line-through">{formatPrice(swap.original.price)}</span>
                    <span className="text-stone-400">→</span>
                    <span className="text-sm font-semibold text-emerald-700">{formatPrice(swap.replacement.price)}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded text-xs font-bold">
                    ↓ {formatPrice(swap.savings)}
                  </span>
                  {swap.reason && (
                    <span className="text-xs text-stone-500" title={swap.reason}>
                      ?
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleSwap(index)}
                  disabled={isSwapped}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                    isSwapped 
                      ? 'bg-stone-200 text-stone-400' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isSwapped ? '✓ Swapped' : 'Swap'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      {remainingSavings > 0 && (
        <div className="px-4 py-3 bg-emerald-100 border-t border-emerald-200">
          <button
            onClick={handleSwapAll}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
          >
            Swap All • Save {formatPrice(remainingSavings)}
          </button>
        </div>
      )}
    </div>
  )
}
