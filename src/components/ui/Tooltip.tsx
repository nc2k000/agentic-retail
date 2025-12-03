'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number>()

  const updatePosition = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPosition({
      top: rect.top + window.scrollY - 8,
      left: rect.left + window.scrollX + rect.width / 2,
    })
  }

  const showTooltip = () => {
    setIsVisible(true)
    updatePosition()

    // Update position on scroll
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updatePosition)
    }
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true })

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true })
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }

  const hideTooltip = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    let cleanup: (() => void) | undefined
    if (isVisible) {
      cleanup = showTooltip()
    }
    return () => {
      cleanup?.()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help inline-flex"
      >
        {children}
      </span>

      {isVisible && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed z-[9999] px-3 py-2 bg-stone-800 text-white text-xs rounded-lg shadow-xl pointer-events-none whitespace-nowrap max-w-xs"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-800" />
        </div>,
        document.body
      )}
    </>
  )
}
