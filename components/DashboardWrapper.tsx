'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/utils/firebase/client'
import { DashboardContent } from './DashboardContent'

interface DashboardWrapperProps {
  serverUser: any
}

export function DashboardWrapper({ serverUser }: DashboardWrapperProps) {
  const [user, setUser] = useState(serverUser)
  const [loading, setLoading] = useState(!serverUser)
  const router = useRouter()


  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login message if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-200">Please Log In</h1>
            <p className="text-gray-400 mb-6">
              You need to be logged in to access the dashboard. Please sign in to continue.
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show dashboard content
  const dashboardUser = {
    id: user.uid,
    email: user.email || undefined
  }

  return <DashboardContent user={dashboardUser} />
}

