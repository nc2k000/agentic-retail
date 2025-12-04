'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface MemoryItem {
  id: string
  type: string
  key: string
  confidence: number
  reason?: string
  source: 'explicit' | 'pattern'
  times_confirmed: number
  created_at: string
  updated_at: string
}

interface MemoryManagementModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function MemoryManagementModal({ isOpen, onClose, userId }: MemoryManagementModalProps) {
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'dietary' | 'brand' | 'favorite' | 'allergy' | 'communication_style'>('all')

  useEffect(() => {
    if (isOpen) {
      loadMemories()
    }
  }, [isOpen, userId])

  const loadMemories = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('customer_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      setMemories(data || [])
    } catch (error) {
      console.error('Failed to load memories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMemory = async (id: string) => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('customer_preferences')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remove from local state
      setMemories(prev => prev.filter(m => m.id !== id))
    } catch (error) {
      console.error('Failed to delete memory:', error)
    }
  }

  const filteredMemories = filter === 'all'
    ? memories
    : memories.filter(m => m.type === filter)

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      dietary: '🥗',
      allergy: '⚠️',
      brand: '🏷️',
      favorite: '⭐',
      communication_style: '💬',
      dislike: '👎',
    }
    return icons[type] || '📝'
  }

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      dietary: 'Dietary',
      allergy: 'Allergy',
      brand: 'Brand',
      favorite: 'Favorite',
      communication_style: 'Communication',
      dislike: 'Dislike',
    }
    return labels[type] || type
  }

  const getSourceLabel = (source: string): string => {
    return source === 'explicit' ? 'You told me' : 'Learned from behavior'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Your Memory</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            View and manage what I've learned about your preferences
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {['all', 'dietary', 'allergy', 'brand', 'favorite', 'communication_style'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterType === 'all' ? 'All' : getTypeLabel(filterType)}
                {filterType !== 'all' && ` (${memories.filter(m => m.type === filterType).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading memories...</div>
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <span className="text-4xl mb-2">🧠</span>
              <p>No memories found</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  View all memories
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMemories.map(memory => (
                <div
                  key={memory.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Type and Key */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{getTypeIcon(memory.type)}</span>
                        <span className="font-semibold text-gray-900">{memory.key}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          memory.source === 'explicit'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getSourceLabel(memory.source)}
                        </span>
                      </div>

                      {/* Reason */}
                      {memory.reason && (
                        <p className="text-sm text-gray-600 mb-2">{memory.reason}</p>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Confidence:</span>
                          <span>{(memory.confidence * 100).toFixed(0)}%</span>
                        </div>
                        {memory.times_confirmed > 1 && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Confirmed:</span>
                            <span>{memory.times_confirmed}x</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Updated:</span>
                          <span>{new Date(memory.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete this memory: "${memory.key}"?`)) {
                          deleteMemory(memory.id)
                        }
                      }}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete memory"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-600">ℹ️</span>
            <div>
              <p className="font-medium mb-1">How Memory Works:</p>
              <p className="text-gray-600">
                I learn your preferences from what you tell me directly and from your shopping patterns.
                You can delete any memory at any time. Deleted preferences won't affect your current cart or orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
