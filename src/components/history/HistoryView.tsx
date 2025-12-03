'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Order, ShoppingList } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface HistoryViewProps {
  user: User
  profile: any
  orders: Order[]
  lists: ShoppingList[]
}

type TabType = 'lists' | 'orders'

export function HistoryView({ user, profile, orders, lists }: HistoryViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('lists')
  const router = useRouter()

  const handleBackToChat = () => {
    router.push('/chat')
  }

  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleBackToChat}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Chat</span>
        </button>

        <h1 className="text-lg font-semibold text-stone-800">History</h1>

        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800"
        >
          Sign Out
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveTab('lists')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'lists'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Shopping Lists ({lists.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {activeTab === 'lists' ? (
          <ListsTab lists={lists} />
        ) : (
          <OrdersTab orders={orders} />
        )}
      </div>
    </div>
  )
}

function ListsTab({ lists }: { lists: ShoppingList[] }) {
  if (lists.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl">📝</span>
        <p className="mt-2 text-stone-500">No shopping lists yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {lists.map((list) => {
        const total = list.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
        const date = new Date(list.createdAt)

        return (
          <div
            key={list.id}
            className="bg-white border border-stone-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-stone-800">{list.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-stone-700">{formatPrice(total)}</p>
                <p className="text-xs text-stone-500">{list.items.length} items</p>
              </div>
            </div>

            {/* Items Preview */}
            <div className="space-y-1.5 mb-3">
              {list.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                  <span>{item.image}</span>
                  <span className="truncate flex-1">{item.name}</span>
                  <span className="text-xs">×{item.quantity || 1}</span>
                </div>
              ))}
              {list.items.length > 3 && (
                <p className="text-xs text-stone-400">+{list.items.length - 3} more items</p>
              )}
            </div>

            {/* Source Badge */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                list.source === 'recipe' ? 'bg-orange-100 text-orange-700' :
                list.source === 'outcome' ? 'bg-blue-100 text-blue-700' :
                list.source === 'reorder' ? 'bg-amber-100 text-amber-700' :
                'bg-stone-100 text-stone-700'
              }`}>
                {list.source === 'recipe' ? '📖 Recipe' :
                 list.source === 'outcome' ? '🎯 Goal' :
                 list.source === 'reorder' ? '🔄 Reorder' :
                 '💬 Chat'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl">📦</span>
        <p className="mt-2 text-stone-500">No orders yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const date = new Date(order.createdAt)
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

        return (
          <div
            key={order.id}
            className="bg-white border border-stone-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-stone-800">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-stone-700">{formatPrice(order.total)}</p>
                <p className="text-xs text-stone-500">{itemCount} items</p>
              </div>
            </div>

            {/* Items Preview */}
            <div className="space-y-1.5 mb-3">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                  <span>{item.image}</span>
                  <span className="truncate flex-1">{item.name}</span>
                  <span className="text-xs">×{item.quantity}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-stone-400">+{order.items.length - 3} more items</p>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                order.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                order.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {order.status === 'confirmed' ? '✓ Confirmed' :
                 order.status === 'delivered' ? '📦 Delivered' :
                 order.status === 'cancelled' ? '✗ Cancelled' :
                 '⏳ Pending'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
