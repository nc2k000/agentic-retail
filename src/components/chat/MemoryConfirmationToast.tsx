'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, X, XCircle } from 'lucide-react'

export interface MemoryConfirmation {
  id: string
  type: 'dietary' | 'brand' | 'favorite' | 'dislike' | 'allergy' | 'replenishment'
  key: string
  message: string
  confidence: number
  reason?: string
}

interface MemoryConfirmationToastProps {
  confirmation: MemoryConfirmation | null
  onConfirm: (confirmed: boolean) => void
  onDismiss: () => void
}

export function MemoryConfirmationToast({
  confirmation,
  onConfirm,
  onDismiss,
}: MemoryConfirmationToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (confirmation) {
      setIsVisible(true)

      // Auto-dismiss after 30 seconds
      const timer = setTimeout(() => {
        handleDismiss()
      }, 30000)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [confirmation])

  const handleConfirm = () => {
    onConfirm(true)
    setIsVisible(false)
  }

  const handleReject = () => {
    onConfirm(false)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    onDismiss()
    setIsVisible(false)
  }

  if (!confirmation || !isVisible) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-lg">🧠</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Memory Check
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {confirmation.message}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Yes
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                No
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Dismiss"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Confidence indicator (optional) */}
        {confirmation.confidence < 0.7 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              I'm {Math.round(confirmation.confidence * 100)}% confident about this
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
