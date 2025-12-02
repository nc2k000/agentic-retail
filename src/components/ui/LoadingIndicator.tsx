'use client'

import { CSSProperties } from 'react'

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-stone-400 text-xs">Thinking...</span>
    </div>
  )
}

interface SkeletonPulseProps {
  className?: string
  style?: CSSProperties
}

// Skeleton components for loading states
export function SkeletonPulse({ className = '', style }: SkeletonPulseProps) {
  return <div className={`animate-pulse bg-stone-200 rounded ${className}`} style={style} />
}

export function SkeletonText({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function SkeletonShopBlock() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mt-3">
      <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex justify-between">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="w-5 h-5" />
          <SkeletonPulse className="w-32 h-4" />
        </div>
        <SkeletonPulse className="w-16 h-5" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonPulse className="w-8 h-8" />
            <div className="flex-1">
              <SkeletonPulse className="w-3/4 h-4 mb-1" />
              <SkeletonPulse className="w-16 h-3" />
            </div>
            <SkeletonPulse className="w-12 h-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
