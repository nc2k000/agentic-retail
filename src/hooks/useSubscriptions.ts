'use client'

import { useState, useEffect, useCallback } from 'react'
import { Subscription, SubscriptionFrequency, Product } from '@/types'

const STORAGE_KEY = 'agentic-retail-subscriptions'
const SUBSCRIPTION_DISCOUNT = 10 // 10% discount for all subscriptions

// Helper: Calculate next delivery date based on frequency
function calculateNextDelivery(frequency: SubscriptionFrequency, fromDate?: Date): string {
  const date = fromDate || new Date()
  const nextDate = new Date(date)

  switch (frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14)
      break
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1)
      break
  }

  return nextDate.toISOString()
}

// Helper: Load subscriptions from localStorage
function loadSubscriptions(): Subscription[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load subscriptions:', error)
    return []
  }
}

// Helper: Save subscriptions to localStorage
function saveSubscriptions(subscriptions: Subscription[]) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions))
  } catch (error) {
    console.error('Failed to save subscriptions:', error)
  }
}

export function useSubscriptions(userId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load subscriptions on mount
  useEffect(() => {
    const loaded = loadSubscriptions()
    // Filter by userId if provided
    const filtered = userId
      ? loaded.filter(sub => sub.userId === userId)
      : loaded
    setSubscriptions(filtered)
    setIsLoading(false)
  }, [userId])

  // Save subscriptions whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveSubscriptions(subscriptions)
    }
  }, [subscriptions, isLoading])

  // Add new subscription
  const addSubscription = useCallback((
    product: Product,
    quantity: number,
    frequency: SubscriptionFrequency,
    userId: string
  ) => {
    const newSubscription: Subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      productSku: product.sku,
      product,
      quantity,
      frequency,
      discount: SUBSCRIPTION_DISCOUNT,
      status: 'active',
      nextDelivery: calculateNextDelivery(frequency),
      createdAt: new Date().toISOString(),
    }

    setSubscriptions(prev => [...prev, newSubscription])
    return newSubscription
  }, [])

  // Update subscription
  const updateSubscription = useCallback((
    subscriptionId: string,
    updates: {
      quantity?: number
      frequency?: SubscriptionFrequency
    }
  ) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id !== subscriptionId) return sub

      const updated: Subscription = {
        ...sub,
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      // Recalculate next delivery if frequency changed
      if (updates.frequency && updates.frequency !== sub.frequency) {
        updated.nextDelivery = calculateNextDelivery(updates.frequency)
      }

      return updated
    }))
  }, [])

  // Pause subscription
  const pauseSubscription = useCallback((subscriptionId: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id !== subscriptionId) return sub
      return {
        ...sub,
        status: 'paused',
        pausedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [])

  // Resume subscription
  const resumeSubscription = useCallback((subscriptionId: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id !== subscriptionId || sub.status !== 'paused') return sub
      return {
        ...sub,
        status: 'active',
        pausedAt: undefined,
        nextDelivery: calculateNextDelivery(sub.frequency),
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [])

  // Cancel subscription
  const cancelSubscription = useCallback((subscriptionId: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id !== subscriptionId) return sub
      return {
        ...sub,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }))
  }, [])

  // Delete subscription permanently
  const deleteSubscription = useCallback((subscriptionId: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId))
  }, [])

  // Check if product is subscribed
  const isProductSubscribed = useCallback((productSku: string) => {
    return subscriptions.some(
      sub => sub.productSku === productSku && sub.status === 'active'
    )
  }, [subscriptions])

  // Get subscription for product
  const getSubscriptionByProduct = useCallback((productSku: string) => {
    return subscriptions.find(
      sub => sub.productSku === productSku && sub.status === 'active'
    )
  }, [subscriptions])

  // Get active subscriptions
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')

  // Get upcoming deliveries (next 7 days)
  const upcomingDeliveries = subscriptions
    .filter(sub => sub.status === 'active')
    .filter(sub => {
      const deliveryDate = new Date(sub.nextDelivery)
      const weekFromNow = new Date()
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      return deliveryDate <= weekFromNow
    })
    .sort((a, b) => new Date(a.nextDelivery).getTime() - new Date(b.nextDelivery).getTime())

  // Calculate total monthly savings
  const monthlySavings = activeSubscriptions.reduce((total, sub) => {
    const itemSavings = (sub.product.price * sub.quantity * sub.discount) / 100
    const monthlyOccurrences = sub.frequency === 'weekly' ? 4 : sub.frequency === 'biweekly' ? 2 : 1
    return total + (itemSavings * monthlyOccurrences)
  }, 0)

  return {
    subscriptions: activeSubscriptions,
    allSubscriptions: subscriptions,
    upcomingDeliveries,
    monthlySavings,
    isLoading,
    addSubscription,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    deleteSubscription,
    isProductSubscribed,
    getSubscriptionByProduct,
  }
}
