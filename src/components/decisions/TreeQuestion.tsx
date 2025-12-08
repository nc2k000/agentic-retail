'use client'

/**
 * TreeQuestion Component
 *
 * Renders an interactive decision tree question in the chat.
 * Displays progress, question, options, and handles user selections.
 */

import { useState } from 'react'
import { DecisionNode } from '@/types'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface TreeQuestionProps {
  treeName: string
  node: DecisionNode
  progress: {
    current: number
    total: number
    percentComplete: number
  }
  onAnswer: (answer: string) => void
  onBack?: () => void
  canGoBack?: boolean
  isComplete?: boolean
}

export function TreeQuestion({
  treeName,
  node,
  progress,
  onAnswer,
  onBack,
  canGoBack = false,
  isComplete = false,
}: TreeQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionClick = (optionValue: string) => {
    setSelectedOption(optionValue)
    // Small delay for visual feedback before submitting
    setTimeout(() => {
      onAnswer(optionValue)
      setSelectedOption(null)
    }, 150)
  }

  // Recommendation node (final step)
  if (node.type === 'recommendation') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">{treeName}</h3>
            <p className="text-sm text-green-700">Complete!</p>
          </div>
        </div>

        {/* Recommendation message */}
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <p className="text-stone-800 whitespace-pre-line">{node.question}</p>
        </div>

        {/* Products will be rendered separately by the chat block renderer */}
      </div>
    )
  }

  // Question node
  return (
    <div className="bg-white border-2 border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-sm font-semibold text-stone-700">
            {progress.current}
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">{treeName}</h3>
            <p className="text-sm text-stone-500">
              Question {progress.current} of {progress.total}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-out"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {progress.percentComplete}%
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
        <p className="text-lg text-stone-900 font-medium">{node.question}</p>
        {node.description && (
          <p className="text-sm text-stone-600 mt-2">{node.description}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {node.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all duration-150
              ${
                selectedOption === option.value
                  ? 'border-green-500 bg-green-50 shadow-md scale-[0.98]'
                  : 'border-stone-200 bg-white hover:border-green-300 hover:bg-green-50/50 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Radio circle */}
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all
                  ${
                    selectedOption === option.value
                      ? 'border-green-500 bg-green-500'
                      : 'border-stone-300 bg-white'
                  }
                `}
              >
                {selectedOption === option.value && (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Option content */}
              <div className="flex-1">
                <p className="font-medium text-stone-900">{option.label}</p>
                {option.description && (
                  <p className="text-sm text-stone-600 mt-1">{option.description}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      {canGoBack && onBack && (
        <div className="flex justify-between items-center pt-2 border-t border-stone-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <p className="text-xs text-stone-400">Select an option to continue</p>
        </div>
      )}
    </div>
  )
}

/**
 * Tree Start Card
 * Shown before the tree begins to introduce it
 */
interface TreeStartProps {
  treeName: string
  description: string
  estimatedTime?: string
  onStart: () => void
  onCancel?: () => void
}

export function TreeStart({
  treeName,
  description,
  estimatedTime = '2-3 minutes',
  onStart,
  onCancel,
}: TreeStartProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-blue-900">{treeName}</h3>
        <p className="text-sm text-blue-700 mt-1">Guided shopping assistant</p>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg p-4 border border-blue-200">
        <p className="text-stone-800">{description}</p>
      </div>

      {/* Info */}
      <div className="flex items-center gap-4 text-sm text-blue-800">
        <div className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          <span>A few quick questions</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⏱️</span>
          <span>{estimatedTime}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onStart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Let's Get Started
          <ChevronRight className="w-4 h-4" />
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-3 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Not Now
          </button>
        )}
      </div>
    </div>
  )
}
