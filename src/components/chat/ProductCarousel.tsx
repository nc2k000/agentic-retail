'use client'

/**
 * Product Carousel Component
 *
 * Displays ranked products in a horizontal scrollable carousel.
 * Used for precision missions where user picks ONE item from multiple options.
 */

import { RankedProduct, CartItem, SuggestionChip } from '@/types'
import { SuggestionChips } from '@/components/blocks/SuggestionChips'
import { useState, useRef, useEffect } from 'react'

interface ProductCarouselProps {
  title: string
  items: RankedProduct[]
  reasoning?: string
  category?: string
  suggestions?: SuggestionChip[]
  onAddToCart: (item: CartItem) => void
  onSendMessage?: (message: string) => void
}

export default function ProductCarousel({
  title,
  items,
  reasoning,
  category,
  suggestions,
  onAddToCart,
  onSendMessage,
}: ProductCarouselProps) {
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleStartList = (product: RankedProduct) => {
    if (onSendMessage) {
      onSendMessage(`Build me an essentials list with ${product.name}`)
    }
  }

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [items, mounted])

  const handleAddToCart = (product: RankedProduct) => {
    onAddToCart({
      ...product,
      quantity: 1,
      source: 'chat',
    })
    setAddedItems((prev) => new Set(prev).add(product.sku))

    // Remove from added state after 2 seconds
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev)
        next.delete(product.sku)
        return next
      })
    }, 2000)
  }

  const getBadgeColor = (badge: string): string => {
    switch (badge) {
      case 'favorite':
        return 'bg-pink-100 text-pink-700'
      case 'usual_choice':
        return 'bg-blue-100 text-blue-700'
      case 'brand_match':
        return 'bg-purple-100 text-purple-700'
      case 'organic':
        return 'bg-green-100 text-green-700'
      case 'best_value':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getBadgeIcon = (badge: string): string => {
    switch (badge) {
      case 'favorite':
        return '⭐'
      case 'usual_choice':
        return '🔄'
      case 'brand_match':
        return '🏷️'
      case 'organic':
        return '🌱'
      case 'best_value':
        return '💰'
      default:
        return '✓'
    }
  }

  const getBadgeLabel = (badge: string): string => {
    switch (badge) {
      case 'favorite':
        return 'Favorite'
      case 'usual_choice':
        return 'Usual Choice'
      case 'brand_match':
        return 'Brand Match'
      case 'organic':
        return 'Organic'
      case 'best_value':
        return 'Best Value'
      default:
        return badge
    }
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {reasoning && (
          <p className="text-sm text-gray-600 mt-1">{reasoning}</p>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-4 snap-x snap-mandatory scrollbar-hide"
        >
          {items.map((product, index) => {
            const isAdded = addedItems.has(product.sku)
            const isTopPick = index === 0

            return (
              <div
                key={product.sku}
                className="flex-shrink-0 w-72 snap-start"
              >
                <div
                  className={`
                    relative
                    bg-white rounded-xl border-2 p-4 h-full flex flex-col
                    transition-all duration-200
                    ${
                      isTopPick
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  {/* Rank Badge */}
                  {isTopPick && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                      Top Pick
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-4xl flex-shrink-0">{product.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  {/* Match Reason */}
                  {product.matchReason && (
                    <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg mb-3 flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="line-clamp-1">{product.matchReason}</span>
                    </div>
                  )}

                  {/* Badges */}
                  {product.badges && product.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.badges.slice(0, 3).map((badge) => (
                        <span
                          key={badge}
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getBadgeColor(
                            badge
                          )}`}
                        >
                          {getBadgeIcon(badge)} {getBadgeLabel(badge)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Add Button */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </div>
                        {product.bulkDeal && (
                          <div className="text-xs text-green-600 font-medium">
                            Save ${product.bulkDeal.savings.toFixed(2)} on bulk
                          </div>
                        )}
                      </div>
                      {index === 0 && (
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Rank</div>
                          <div className="text-lg font-bold text-blue-600">
                            #{product.rank}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isAdded}
                        className={`
                          w-full py-2.5 px-4 rounded-lg font-medium text-sm
                          transition-all duration-200
                          ${
                            isAdded
                              ? 'bg-green-500 text-white'
                              : isTopPick
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }
                        `}
                      >
                        {isAdded ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Added!
                          </span>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>

                      {onSendMessage && (
                        <button
                          onClick={() => handleStartList(product)}
                          className="w-full py-2 px-4 rounded-lg font-medium text-xs text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-blue-200"
                        >
                          Start a List
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Left Scroll Arrow - Only render after mount to avoid hydration mismatch */}
        {mounted && canScrollLeft && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-gradient-to-r from-white via-white to-transparent w-16 h-full" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Right Scroll Arrow - Only render after mount to avoid hydration mismatch */}
        {mounted && canScrollRight && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-gradient-to-l from-white via-white to-transparent w-16 h-full" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Product Count */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        Showing {items.length} option{items.length !== 1 ? 's' : ''} • Swipe to see more
      </div>

      {/* Suggestion Chips */}
      {suggestions && suggestions.length > 0 && onSendMessage && (
        <div className="mt-4">
          <SuggestionChips chips={suggestions} onSelect={onSendMessage} />
        </div>
      )}
    </div>
  )
}
