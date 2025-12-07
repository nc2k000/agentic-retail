'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MemoryPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to profile page - they show the same data
    router.replace('/profile')
  }, [router])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-stone-600">Redirecting to profile...</p>
    </div>
  )
}
