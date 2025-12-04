'use client'

import { useState } from 'react'
import { Subscription } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'

interface AutoCartSimulationProps {
  subscriptions: Subscription[]
}

// Helper: Get all days in a month
function getDaysInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay() // 0 = Sunday

  return { daysInMonth, startingDayOfWeek, firstDay, lastDay }
}

// Helper: Calculate all delivery dates for a subscription within a date range
function getDeliveryDatesInRange(subscription: Subscription, startDate: Date, endDate: Date): Date[] {
  if (subscription.status !== 'active') return []

  const deliveryDates: Date[] = []
  let currentDelivery = new Date(subscription.nextDelivery)

  // Calculate frequency in days
  const frequencyDays =
    subscription.frequency === 'weekly' ? 7 :
    subscription.frequency === 'biweekly' ? 14 : 30

  // Generate all delivery dates in range
  while (currentDelivery <= endDate) {
    if (currentDelivery >= startDate) {
      deliveryDates.push(new Date(currentDelivery))
    }
    // Add frequency to get next delivery
    currentDelivery = new Date(currentDelivery.getTime() + frequencyDays * 24 * 60 * 60 * 1000)
  }

  return deliveryDates
}

// Helper: Get deliveries for a specific date
function getDeliveriesForDate(subscriptions: Subscription[], date: Date, monthStart: Date, monthEnd: Date) {
  const dateStr = date.toISOString().split('T')[0]

  const deliveriesForDate: Subscription[] = []

  subscriptions.forEach(sub => {
    const deliveryDates = getDeliveryDatesInRange(sub, monthStart, monthEnd)
    const hasDeliveryOnDate = deliveryDates.some(d => d.toISOString().split('T')[0] === dateStr)
    if (hasDeliveryOnDate) {
      deliveriesForDate.push(sub)
    }
  })

  return deliveriesForDate
}

export function AutoCartSimulation({ subscriptions }: AutoCartSimulationProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const { daysInMonth, startingDayOfWeek, firstDay, lastDay } = getDaysInMonth(year, month)

  if (subscriptions.length === 0) return null

  // Create calendar grid
  const calendarDays: (number | null)[] = []
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span>📅</span>
          <span>Delivery Calendar</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          View your upcoming subscription deliveries
        </p>
      </div>

      <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-lg">{monthName}</h3>
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors"
            >
              Today
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square border border-gray-100 bg-gray-50" />
                }

                const date = new Date(year, month, day)
                const deliveries = getDeliveriesForDate(subscriptions, date, firstDay, lastDay)
                const hasDeliveries = deliveries.length > 0
                const isToday = date.toDateString() === new Date().toDateString()

                // Calculate total savings for this day
                const totalSavings = deliveries.reduce((sum, sub) => {
                  return sum + (sub.product.price * sub.quantity * sub.discount / 100)
                }, 0)

                return (
                  <div
                    key={day}
                    className={`aspect-square border border-gray-100 p-2 relative ${
                      isToday ? 'bg-purple-50 border-purple-300' : 'bg-white'
                    }`}
                  >
                    {/* Day Number */}
                    <div className={`text-xs font-medium mb-1 ${
                      isToday ? 'text-purple-700' : 'text-gray-600'
                    }`}>
                      {day}
                    </div>

                    {/* Delivery Emojis */}
                    {hasDeliveries && (
                      <div className="flex flex-wrap gap-0.5 items-center justify-center">
                        {deliveries.slice(0, 4).map((sub, i) => {
                          const savings = formatPrice(sub.product.price * sub.quantity * sub.discount / 100)
                          const tooltipContent = `${sub.product.name} - Qty: ${sub.quantity} • ${sub.frequency} - Save ${savings}`

                          return (
                            <Tooltip key={i} content={tooltipContent}>
                              <span className="text-lg cursor-help">{sub.product.image}</span>
                            </Tooltip>
                          )
                        })}
                        {deliveries.length > 4 && (
                          <span className="text-xs text-gray-500 font-medium">
                            +{deliveries.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Savings Badge */}
                    {hasDeliveries && totalSavings > 0 && (
                      <div className="absolute bottom-1 right-1">
                        <Tooltip content={`Total savings: ${formatPrice(totalSavings)}`}>
                          <div className="text-[9px] px-1 py-0.5 bg-green-100 text-green-700 rounded font-semibold cursor-help">
                            -{formatPrice(totalSavings)}
                          </div>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How Deliveries Work:</p>
                <p>
                  On each delivery day, subscribed items are automatically added to your cart.
                  Hover over product emojis to see details. You'll save 10% on all subscription items.
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
