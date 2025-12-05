'use client'

import { useState } from 'react'
import { CartItem, ShoppingList, Product, SubscriptionFrequency, SuggestionChip } from '@/types'
import { SuggestionChips } from '@/components/blocks/SuggestionChips'
import { formatPrice } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'
import { SubscribeModal } from '@/components/subscriptions/SubscribeModal'
import { isProductEligibleForSubscription } from '@/lib/subscriptions'

interface ShopBlockProps {
  data: {
    title: string
    items: CartItem[]
    source?: string
    suggestions?: SuggestionChip[]
  }
  onAddToCart: (item: CartItem) => void
  onAddAllToCart: (items: CartItem[]) => void
  onFindSavings: () => void
  activeList: ShoppingList | null
  onUpdateActiveList: (list: ShoppingList | null) => void
  onSubscribe?: (product: Product, quantity: number, frequency: SubscriptionFrequency) => void
  isProductSubscribed?: (sku: string) => boolean
  onSendMessage?: (message: string) => void
}

export function ShopBlock({
  data,
  onAddToCart,
  onAddAllToCart,
  onFindSavings,
  activeList,
  onUpdateActiveList,
  onSubscribe,
  isProductSubscribed,
  onSendMessage,
}: ShopBlockProps) {
  const [editedItems, setEditedItems] = useState<CartItem[] | null>(null)
  const [subscribeModalProduct, setSubscribeModalProduct] = useState<{ product: Product; quantity: number } | null>(null)
  
  // Use edited items if available, otherwise original
  const isActiveList = activeList && activeList.title === data.title
  const items = isActiveList ? activeList.items : (editedItems || data.items)
  
  // Group by category
  const categories: Record<string, CartItem[]> = {}
  items.forEach(item => {
    const cat = item.category || 'Other'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push(item)
  })

  // Initialize all categories as expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}
    Object.keys(categories).forEach(cat => {
      initialState[cat] = true
    })
    return initialState
  })
  
  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const hasEdits = editedItems !== null && editedItems.length !== data.items.length

  const updateQuantity = (sku: string, delta: number) => {
    const updateItems = (prevItems: CartItem[]) => 
      prevItems.map(item => 
        item.sku === sku 
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    
    if (isActiveList && activeList) {
      onUpdateActiveList({ ...activeList, items: updateItems(activeList.items) })
    } else {
      setEditedItems(prev => updateItems(prev || data.items))
    }
  }

  const removeItem = (sku: string) => {
    const filterItems = (prevItems: CartItem[]) => 
      prevItems.filter(item => item.sku !== sku)
    
    if (isActiveList && activeList) {
      onUpdateActiveList({ ...activeList, items: filterItems(activeList.items) })
    } else {
      setEditedItems(prev => filterItems(prev || data.items))
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-3 bg-white border border-stone-200 rounded-xl p-6 text-center">
        <span className="text-3xl">🗑️</span>
        <p className="text-stone-500 mt-2">List cleared</p>
      </div>
    )
  }

  return (
    <div className="mt-3 bg-white border border-stone-200 rounded-xl overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="px-3 sm:px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-lg flex-shrink-0">🛒</span>
          <span className="font-medium text-stone-800 truncate">{data.title}</span>
          {hasEdits && (
            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full flex-shrink-0">edited</span>
          )}
        </div>
        <span className="text-sm text-stone-500 flex-shrink-0 whitespace-nowrap">
          {items.length} • {formatPrice(total)}
        </span>
      </div>

      {/* Categories */}
      <div className="divide-y divide-stone-100">
        {Object.entries(categories).map(([category, categoryItems]) => (
          <div key={category}>
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-stone-50 transition-colors min-w-0"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <svg
                  className={`w-4 h-4 text-stone-400 transition-transform flex-shrink-0 ${expandedCategories[category] ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-stone-700 truncate">{category}</span>
                <span className="text-xs text-stone-400 flex-shrink-0">({categoryItems.length})</span>
              </div>
              <span className="text-sm text-stone-500 flex-shrink-0 whitespace-nowrap">
                {formatPrice(categoryItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0))}
              </span>
            </button>

            {/* Category Items */}
            {expandedCategories[category] && (
              <div className="px-3 sm:px-4 pb-3 space-y-2">
                {categoryItems.map(item => {
                  // Get source badge info
                  const getSourceBadge = () => {
                    if (item.isSwapped || item.source === 'savings') {
                      return { text: 'Swapped', className: 'bg-emerald-100 text-emerald-700', icon: '↔️' }
                    }
                    switch (item.source) {
                      case 'recipe':
                        return { text: 'Recipe', className: 'bg-orange-100 text-orange-700', icon: '📖' }
                      case 'essentials':
                        return { text: 'Essential', className: 'bg-blue-100 text-blue-700', icon: '⭐' }
                      case 'upsell':
                        return { text: 'Suggested', className: 'bg-purple-100 text-purple-700', icon: '💡' }
                      case 'reorder':
                        return { text: 'Reorder', className: 'bg-amber-100 text-amber-700', icon: '🔄' }
                      default:
                        return null
                    }
                  }
                  const badge = getSourceBadge()

                  return (
                  <div
                    key={item.sku}
                    className={`flex items-center gap-1.5 sm:gap-2 p-2 rounded-lg group w-full min-w-0 ${
                      item.isSwapped || item.source === 'savings'
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-stone-50'
                    }`}
                  >
                    <span className="text-base sm:text-xl flex-shrink-0">{item.image}</span>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-1 overflow-hidden">
                        <p className="text-xs sm:text-sm font-medium text-stone-800 truncate flex-1 min-w-0">{item.name}</p>
                        {badge && (
                          <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-medium ${badge.className} flex-shrink-0 whitespace-nowrap hidden xs:inline-block`}>
                            {badge.icon} {badge.text}
                          </span>
                        )}
                        {item.reason && (
                          <Tooltip content={item.reason}>
                            <span className="text-[10px] text-stone-400 hover:text-stone-500 flex-shrink-0">
                              ⓘ
                            </span>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-stone-500 truncate">{formatPrice(item.price)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.sku, -1)}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 text-xs sm:text-sm"
                      >
                        −
                      </button>
                      <span className="w-4 sm:w-6 text-center text-xs sm:text-sm">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, 1)}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 text-xs sm:text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.sku)}
                      className="p-1 text-stone-400 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Subscribe Button - Only for eligible products */}
                    {onSubscribe && !isProductSubscribed?.(item.sku) && isProductEligibleForSubscription(item) && (
                      <button
                        onClick={() => setSubscribeModalProduct({ product: item, quantity: item.quantity || 1 })}
                        className="px-1.5 sm:px-2 py-1 sm:py-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] sm:text-xs font-medium rounded-lg transition-colors flex-shrink-0 whitespace-nowrap"
                        title="Subscribe & Save 10%"
                      >
                        ♻️
                      </button>
                    )}

                    {/* Subscribed Badge */}
                    {isProductSubscribed?.(item.sku) && (
                      <div className="px-1.5 sm:px-2 py-1 sm:py-1.5 bg-green-100 text-green-700 text-[10px] sm:text-xs font-medium rounded-lg flex-shrink-0 whitespace-nowrap">
                        ✓ Sub
                      </div>
                    )}

                    {/* Add to Cart */}
                    <button
                      onClick={() => onAddToCart({ ...item, quantity: item.quantity || 1 })}
                      className="px-1.5 sm:px-2 py-1 sm:py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-medium rounded-lg transition-colors flex-shrink-0 whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 sm:px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onFindSavings}
          className="flex-1 min-w-0 py-2.5 border border-emerald-500 text-emerald-600 rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-50 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <span className="hidden sm:inline">💰 Find Savings</span>
          <span className="sm:hidden">💰 Save</span>
        </button>
        <button
          onClick={() => onAddAllToCart(items)}
          className="flex-1 min-w-0 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <span className="hidden sm:inline">Add all • {formatPrice(total)}</span>
          <span className="sm:hidden">Add • {formatPrice(total)}</span>
        </button>
      </div>

      {/* Suggestion Chips */}
      {data.suggestions && data.suggestions.length > 0 && onSendMessage && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <SuggestionChips chips={data.suggestions} onSelect={onSendMessage} />
        </div>
      )}

      {/* Subscribe Modal */}
      {subscribeModalProduct && onSubscribe && (
        <SubscribeModal
          product={subscribeModalProduct.product}
          quantity={subscribeModalProduct.quantity}
          onSubscribe={(frequency) => {
            onSubscribe(subscribeModalProduct.product, subscribeModalProduct.quantity, frequency)
          }}
          onClose={() => setSubscribeModalProduct(null)}
        />
      )}
    </div>
  )
}
