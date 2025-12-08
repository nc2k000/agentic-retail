'use client'

import { useState } from 'react'
import { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'

interface CompareOption {
  sku: string
  name: string
  price: number
  image: string
  highlights: string[]
  bestFor: string
  recommended?: boolean
}

interface CompareBlockProps {
  data: {
    category: string
    recommendation: string
    options: CompareOption[]
    suggestions?: Array<{ label: string; prompt: string }>
  }
  onAddToCart: (item: CartItem) => void
  onSendMessage: (message: string) => void
}

export function CompareBlock({ data, onAddToCart, onSendMessage }: CompareBlockProps) {
  const { category, recommendation, options, suggestions } = data
  const [selectedSku, setSelectedSku] = useState<string | null>(null)

  const handleAddToCart = (option: CompareOption) => {
    setSelectedSku(option.sku)
    onAddToCart({
      sku: option.sku,
      name: option.name,
      price: option.price,
      image: option.image,
      category: category,
      quantity: 1,
      source: 'chat',
      isSwapped: false,
    })
  }

  return (
    <div className="my-4 border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3">
        <h3 className="font-semibold text-white text-sm">
          Comparing {category}
        </h3>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
          <div className="flex items-start gap-2">
            <span className="text-amber-600 flex-shrink-0 mt-0.5">💡</span>
            <p className="text-sm text-amber-900 leading-relaxed">{recommendation}</p>
          </div>
        </div>
      )}

      {/* Comparison Grid - Optimized for mobile */}
      <div className="p-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
        {options.map((option) => {
          const isSelected = selectedSku === option.sku
          return (
            <div
              key={option.sku}
              className={`relative border rounded-lg p-4 transition-all hover:shadow-md ${
                isSelected
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-opacity-50'
                  : option.recommended
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500 ring-opacity-50'
                  : 'border-stone-200 bg-white hover:border-amber-300'
              }`}
            >
              {/* Recommended Badge - Always visible if recommended */}
              {option.recommended && (
                <div className="absolute -top-2 left-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md whitespace-nowrap z-10">
                  ⭐ Recommended
                </div>
              )}

              {/* Selected Badge - Shows when user clicks */}
              {isSelected && (
                <div className="absolute -top-2 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md whitespace-nowrap z-10">
                  ✓ Selected
                </div>
              )}

              {/* Product Info */}
              <div className="text-center mb-3 mt-2">
                <div className="text-3xl mb-2">{option.image}</div>
                <h4 className="font-medium text-stone-900 text-sm leading-tight mb-1">
                  {option.name}
                </h4>
                <p className="text-xl font-bold text-amber-600">
                  {formatPrice(option.price)}
                </p>
              </div>

              {/* Highlights */}
              {option.highlights && option.highlights.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-stone-700 mb-1.5">Features:</p>
                  <ul className="space-y-1">
                    {option.highlights.map((highlight, i) => (
                      <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                        <span className="text-amber-500 flex-shrink-0 mt-0.5">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best For */}
              {option.bestFor && (
                <div className="mb-3 pb-3 border-b border-stone-200">
                  <p className="text-xs font-semibold text-stone-700 mb-1">Best for:</p>
                  <p className="text-xs text-stone-600 italic">{option.bestFor}</p>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(option)}
                className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                  isSelected
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : option.recommended
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                {isSelected ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer with Suggestion Chips */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200">
        {suggestions && suggestions.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion.prompt)}
                className="px-4 py-2 bg-white border border-stone-300 rounded-full text-sm font-medium text-stone-700 hover:bg-stone-100 hover:border-stone-400 transition-colors"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 text-center">
            Need help deciding? Ask me about specific features or use cases!
          </p>
        )}
      </div>
    </div>
  )
}
