'use client'

import { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { getBulkDealForItem } from '@/lib/bulkDeals'
import { SavingsBlock } from '@/components/blocks/SavingsBlock'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (sku: string, quantity: number) => void
  onRemove: (sku: string) => void
  onCheckout: () => void
  onFindSavings: () => void
  onClearCart: () => void
  cartSavingsData?: any
  isLoadingCartSavings?: boolean
  onCartSwap?: (original: CartItem, replacement: CartItem) => void
  onAddToCart?: (item: CartItem) => void
  isProductSubscribed?: (sku: string) => boolean
}

export function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onFindSavings,
  onClearCart,
  cartSavingsData,
  isLoadingCartSavings,
  onCartSwap,
  onAddToCart,
  isProductSubscribed,
}: CartSidebarProps) {
  // Calculate total with bulk discounts applied
  const total = cart.reduce((sum, item) => {
    // Check if item qualifies for bulk discount
    if (item.bulkDeal && item.quantity >= item.bulkDeal.qty) {
      // Calculate how many bulk deals fit
      const bulkSets = Math.floor(item.quantity / item.bulkDeal.qty)
      const remaining = item.quantity % item.bulkDeal.qty
      return sum + (bulkSets * item.bulkDeal.price) + (remaining * item.price)
    }
    return sum + item.price * item.quantity
  }, 0)

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-stone-800">Your Cart</h2>
              <p className="text-sm text-stone-500">{itemCount} items • {formatPrice(total)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {cart.length > 0 && (
            <button
              onClick={onClearCart}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all items
            </button>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-4xl mb-3">🛒</span>
              <p className="text-stone-500">Your cart is empty</p>
              <p className="text-sm text-stone-400 mt-1">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => {
                const bulkDeal = getBulkDealForItem(item)
                const isSubscribed = isProductSubscribed?.(item.sku) || false

                // Check if bulk discount is active
                const isBulkActive = item.bulkDeal && item.quantity >= item.bulkDeal.qty
                const itemTotal = isBulkActive
                  ? Math.floor(item.quantity / item.bulkDeal!.qty) * item.bulkDeal!.price +
                    (item.quantity % item.bulkDeal!.qty) * item.price
                  : item.price * item.quantity

                return (
                  <div key={item.sku}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${isBulkActive ? 'bg-amber-50 border border-amber-200' : 'bg-stone-50'}`}>
                      <span className="text-2xl">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                          {isSubscribed && (
                            <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-semibold" title="Subscribed">
                              ♻️ Sub
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isBulkActive ? (
                            <>
                              <span className="text-xs text-stone-400 line-through">{formatPrice(item.price * item.quantity)}</span>
                              <span className="text-sm font-semibold text-emerald-600">{formatPrice(itemTotal)}</span>
                              <span className="text-[10px] text-emerald-600 font-medium">Bulk!</span>
                            </>
                          ) : (
                            <span className="text-sm text-stone-500">{formatPrice(item.price)} ea</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateQuantity(item.sku, item.quantity - 1)}
                          className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 touch-manipulation"
                        >
                          −
                        </button>
                        <span className="w-9 sm:w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.sku, item.quantity + 1)}
                          className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 touch-manipulation"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => onRemove(item.sku)}
                        className="p-2 sm:p-1 text-stone-400 hover:text-red-500 transition-colors touch-manipulation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Bulk Deal Notification */}
                    {bulkDeal && (
                      <div className="mt-2 mx-1 sm:mx-3 p-2 sm:p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg flex items-center gap-1.5 sm:gap-2 w-full max-w-full">
                        <span className="text-base sm:text-lg flex-shrink-0">💡</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] sm:text-xs font-medium text-amber-900 leading-tight">{bulkDeal.message}</p>
                          <p className="text-[9px] sm:text-[10px] text-amber-700 mt-0.5">
                            Buy {bulkDeal.bulkDeal.qty} for ${bulkDeal.bulkDeal.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => onUpdateQuantity(item.sku, bulkDeal.bulkDeal.qty)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-medium rounded-lg whitespace-nowrap touch-manipulation transition-colors flex-shrink-0"
                        >
                          Add {bulkDeal.quantityNeeded}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Savings Section */}
          {cart.length > 0 && (
            <>
              {isLoadingCartSavings && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-emerald-700">Finding savings...</span>
                  </div>
                </div>
              )}

              {cartSavingsData && onCartSwap && onAddToCart && (
                <div className="mt-4">
                  <SavingsBlock
                    data={cartSavingsData}
                    onSwap={onCartSwap}
                    onAddToCart={onAddToCart}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-stone-200 p-4 space-y-3">
            {/* Find Savings Button */}
            <button
              onClick={onFindSavings}
              className="w-full py-3 sm:py-2.5 min-h-[48px] border border-emerald-500 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 touch-manipulation"
            >
              <span>💰</span>
              Find Savings
            </button>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full py-3.5 sm:py-3 min-h-[52px] bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors touch-manipulation"
            >
              Checkout • {formatPrice(total)}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
