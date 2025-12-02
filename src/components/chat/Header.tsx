'use client'

import { User } from '@supabase/supabase-js'
import { useState } from 'react'

interface HeaderProps {
  user: User
  profile: any
  cartCount: number
  cartTotal: number
  voiceEnabled: boolean
  onToggleVoice: () => void
  onOpenCart: () => void
  onNewChat: () => void
  onSignOut: () => void
}

export function Header({
  user,
  profile,
  cartCount,
  cartTotal,
  voiceEnabled,
  onToggleVoice,
  onOpenCart,
  onNewChat,
  onSignOut,
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <div>
          <h1 className="font-semibold text-stone-800">Agentic Retail</h1>
          <p className="text-xs text-stone-500">Powered by Claude</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* New Chat */}
        <button
          onClick={onNewChat}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
          title="New Chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Voice Toggle */}
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-lg transition-colors ${
            voiceEnabled 
              ? 'bg-amber-100 text-amber-700' 
              : 'hover:bg-stone-100 text-stone-600'
          }`}
          title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
        >
          {voiceEnabled ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Cart Button */}
        <button
          onClick={onOpenCart}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && (
            <>
              <span className="text-sm font-medium">{cartCount}</span>
              <span className="text-sm">•</span>
              <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
            </>
          )}
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-300 transition-colors"
          >
            {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-stone-100">
                  <p className="text-sm font-medium text-stone-800">{profile?.name || 'User'}</p>
                  <p className="text-xs text-stone-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={onSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
