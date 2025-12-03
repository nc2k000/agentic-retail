'use client'

import { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (sku: string, quantity: number) => void
  onRemove: (sku: string) => void
  onCheckout: () => void
  onFindSavings: () => void
  onClearCart: () => void
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
}: CartSidebarProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
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
              {cart.map(item => (
                <div 
                  key={item.sku}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl"
                >
                  <span className="text-2xl">{item.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                    <p className="text-sm text-stone-500">{formatPrice(item.price)}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(item.sku, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.sku, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemove(item.sku)}
                    className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-stone-200 p-4 space-y-3">
            {/* Find Savings Button */}
            <button
              onClick={onFindSavings}
              className="w-full py-2.5 border border-emerald-500 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>💰</span>
              Find Savings
            </button>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
            >
              Checkout • {formatPrice(total)}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
