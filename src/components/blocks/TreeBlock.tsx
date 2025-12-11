'use client'

/**
 * TreeBlock Component
 *
 * Wrapper for decision tree flow in chat.
 * Manages tree execution state and handles user interactions.
 */

import { useState, useEffect } from 'react'
import { TreeQuestion } from '@/components/decisions/TreeQuestion'
import { DecisionTreeExecutor, createExecutor } from '@/lib/decisions/executor'
import { getTreeById, getTreeByIdAsync } from '@/lib/decisions/trees'

interface TreeBlockProps {
  data: {
    treeId: string
    treeName: string
    description: string
    estimatedTime?: string
    suggestions?: Array<{ label: string; prompt: string }>
  }
  onSendMessage: (message: string) => void
  onMissionUpdate?: () => Promise<void>
}

export function TreeBlock({ data, onSendMessage, onMissionUpdate }: TreeBlockProps) {
  const [executor, setExecutor] = useState<DecisionTreeExecutor | null>(null)
  const [hasStarted, setHasStarted] = useState(true) // Auto-start enabled
  const [currentStep, setCurrentStep] = useState<any>(null)

  // Initialize executor when component mounts and auto-start
  useEffect(() => {
    async function loadTree() {
      // Try synchronous first (hardcoded trees)
      let tree = getTreeById(data.treeId)

      // If not found, fetch from API (AI-generated trees)
      if (!tree) {
        console.log(`🔍 Tree not in hardcoded list, fetching from API: ${data.treeId}`)
        try {
          const response = await fetch(`/api/trees/${data.treeId}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch tree: ${response.statusText}`)
          }
          const result = await response.json()
          tree = result.tree
        } catch (error) {
          console.error(`❌ Failed to load tree from API:`, error)
        }
      }

      if (!tree) {
        console.error(`Tree not found: ${data.treeId}`)
        return
      }

      console.log(`✅ Tree loaded: ${tree.id} (${tree.name})`)
      const exec = createExecutor(tree)
      setExecutor(exec)
      setCurrentStep(exec.getCurrentStep())
    }

    loadTree()
  }, [data.treeId])

  const handleAnswer = async (answer: string) => {
    if (!executor) return

    const result = executor.answerQuestion(answer)
    setCurrentStep(result)

    // Save progress to missions table after each answer
    await saveMissionProgress(false)

    // If we've reached the end, mark mission as complete
    if (result.isComplete) {
      const summary = executor.getAnswerSummary()
      const filters = executor.getProductFilters()

      // Save completed mission state
      await saveMissionProgress(true)

      // Notify parent to refresh mission data and wait for it to complete
      if (onMissionUpdate) {
        await onMissionUpdate()
      }

      // Send clean user message - AI will use rank_products with the context
      const userReadable = summary.map(qa => `${qa.answer}`).join(', ')
      const message = `Show me the best options based on my answers: ${userReadable}`

      onSendMessage(message)
    }
  }

  /**
   * Save mission progress to database
   * Stores decision tree state for resumption (implicit data)
   * Does NOT write to household_facts until checkout confirmation
   */
  const saveMissionProgress = async (isComplete: boolean) => {
    if (!executor) return

    try {
      const summary = executor.getAnswerSummary()
      const filters = executor.getProductFilters()

      // Convert summary to key-value object
      const treeAnswers: Record<string, string> = {}
      summary.forEach(({ question, answer }) => {
        treeAnswers[question] = answer
      })

      await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treeId: data.treeId,
          query: `${data.treeName} search`,
          treeAnswers,
          treeFilters: filters,
          treeCompleted: isComplete,
          funnelStage: isComplete ? 'comparing' : 'browsing'
        })
      })

      console.log(`💾 Saved mission progress for ${data.treeId} (completed: ${isComplete})`)
    } catch (error) {
      console.error('Failed to save mission progress:', error)
      // Don't block user flow if save fails
    }
  }

  const handleBack = () => {
    if (!executor) return

    const result = executor.goBack()
    if (result) {
      setCurrentStep(result)
    }
  }

  if (!executor || !currentStep) {
    return null // No loading UI, tree will appear instantly
  }

  // Show question directly (auto-started)
  return (
    <div className="mt-4">
      <TreeQuestion
        treeName={data.treeName}
        node={currentStep.currentQuestion}
        progress={currentStep.progress}
        onAnswer={handleAnswer}
        onBack={handleBack}
        canGoBack={Object.keys(executor.getState().answers).length > 0}
        isComplete={currentStep.isComplete}
      />
    </div>
  )
}
