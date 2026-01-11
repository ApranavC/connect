'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Video, LogOut, Users, RefreshCw } from 'lucide-react'
import { VideoCall } from './VideoCall'
import { createVideoRoom } from '@/utils/videosdk'
import { auth, db } from '@/utils/firebase/client'
import { signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, limit, onSnapshot } from 'firebase/firestore'
import { createUserProfile, setUserAvailability } from '@/utils/firebase/firestore'

interface DashboardContentProps {
  user: {
    id: string
    email?: string
  }
}

interface AvailableUser {
  id: string
  username: string | null
  email: string
  gender: string
  is_available: boolean
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [incomingCall, setIncomingCall] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [meetingId, setMeetingId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([])
  const router = useRouter()

  // Fetch random available users
  const fetchAvailableUsers = async () => {
    setLoadingUsers(true)
    try {
      // First, ensure current user's profile exists and is marked as available
      const userRef = doc(db, 'users', user.id)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        const username = user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`
        // Create profile. using helper or direct. Helper logic is slightly different, let's stick to what was here roughly.
        // Actually, let's use the helper but make sure we set availability TRUE here.
        await createUserProfile(user.id, {
          email: user.email!,
          gender: 'Male', // Default, simplistic for now
          is_available: true,
          // username property needs to be added to UserProfile interface if we want it there, 
          // but the interface in firestore.ts didn't have it. 
          // I'll add it to the data object blindly or update the interface. 
          // For now, let's treat it as flexible.
        } as any)
      } else {
        await updateDoc(userRef, { is_available: true, updated_at: new Date().toISOString() })
      }

      // Fetch available users (excluding current user)
      const usersRef = collection(db, 'users')
      const q = query(
        usersRef,
        where('is_available', '==', true),
        limit(20) // Get more than 5 to shuffle
      )

      const querySnapshot = await getDocs(q)
      const fetchedUsers: AvailableUser[] = []

      querySnapshot.forEach((doc) => {
        if (doc.id !== user.id) {
          const data = doc.data()
          fetchedUsers.push({
            id: doc.id,
            username: data.username || data.email?.split('@')[0] || 'User',
            email: data.email || 'Unknown',
            gender: data.gender || 'Unknown',
            is_available: data.is_available
          })
        }
      })

      // Shuffle and take random users
      const shuffled = fetchedUsers.sort(() => 0.5 - Math.random())
      setAvailableUsers(shuffled.slice(0, 5))
    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError(err.message || 'Failed to load available users')
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchAvailableUsers()

    // Auto-refresh disabled for testing to reduce API calls
    /*
    const interval = setInterval(() => {
      fetchAvailableUsers()
    }, 5000)

    return () => clearInterval(interval)
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  // Listen for incoming calls
  useEffect(() => {
    if (!user?.id) return

    console.log('Setting up snapshot listener for user:', user.id)
    const unsubscribe = onSnapshot(doc(db, 'users', user.id), (docSnapshot) => {
      console.log('Snapshot update:', docSnapshot.data())
      if (docSnapshot.exists()) {
        const data = docSnapshot.data()
        if (data.incomingCall) {
          console.log('Incoming call detected:', data.incomingCall)
          // Check if call is stale (older than 1 minute)
          const now = Date.now()
          if (now - data.incomingCall.timestamp > 60000) {
            console.log('Call is stale, clearing...')
            // Cleanup stale call
            updateDoc(doc(db, 'users', user.id), { incomingCall: null })
            return
          }
          setIncomingCall(data.incomingCall)
        } else {
          setIncomingCall(null)
        }
      }
    })

    return () => unsubscribe()
  }, [user.id])

  // Handle browser back button to close meeting instead of leaving page
  useEffect(() => {
    if (meetingId) {
      // Push state to trap back button
      window.history.pushState(null, "", window.location.href)

      const handlePopState = (event: PopStateEvent) => {
        event.preventDefault()
        // If in meeting, just close it
        handleMeetingLeft()
        // Replace history to remove the pushed state effectively? 
        // Or just let the pop happen (which we prevented default?). 
        // Actually, popstate event is fired *after* history entry changes.
        // We want to just ensure we are back on the "Dashboard" state.
        // The simplest logic is: if we catch a popstate while in meeting, we exit meeting.
        // But since we pushed a state, the pop takes us back to "Main Dashboard".
        // Perfect.
      }

      window.addEventListener("popstate", handlePopState)

      return () => {
        window.removeEventListener("popstate", handlePopState)
        // Clean up history entry if component unmounts while in meeting?
        // Might be tricky, but basic trapping is good enough for now.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId])

  const handleStartCall = async (targetUserId?: string) => {
    setLoading(true)
    setError(null)

    try {
      // Step 1: Get VideoSDK token from our new API route
      const tokenResponse = await fetch('/api/video-token')

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json()
        throw new Error(errorData.error || 'Failed to get video token')
      }

      const { token: videoToken } = await tokenResponse.json()

      // Step 2: Create a new room using the VideoSDK API
      const roomResponse = await createVideoRoom(videoToken)
      const roomId = roomResponse.roomId

      if (!roomId) throw new Error('Failed to create room')

      console.log('Created new room:', roomId)

      // Step 3: Trigger the call for the other user (if targetUserId is provided)
      if (targetUserId) {
        console.log('Writing incomingCall to target user:', targetUserId)
        try {
          await updateDoc(doc(db, 'users', targetUserId), {
            incomingCall: {
              callerId: user.id,
              callerName: user.email?.split('@')[0] || 'Unknown',
              roomId: roomId,
              timestamp: Date.now()
            }
          })
          console.log('Successfully wrote incomingCall to Firestore')
        } catch (writeErr) {
          console.error('Failed to write incomingCall:', writeErr)
        }
      }

      setToken(videoToken)
      setMeetingId(roomId)
    } catch (err: any) {
      setError(err.message || 'Failed to start call')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    // Mark user as unavailable before logging out
    try {
      await setUserAvailability(user.id, false)
    } catch (e) {
      console.error('Failed to set unavailable on logout', e)
    }

    await signOut(auth)
    // Use window.location for a full page reload to ensure session is cleared
    window.location.href = '/'
  }

  const handleMeetingLeft = () => {
    setMeetingId(null)
    setToken(null)
    // Refresh available users after leaving a call
    fetchAvailableUsers()
  }

  const handleAcceptCall = async () => {
    if (!incomingCall) return

    try {
      // 1. Get token if we don't have one (though we might want to do this earlier)
      const tokenResponse = await fetch('/api/video-token')
      const { token: videoToken } = await tokenResponse.json()
      setToken(videoToken)

      // 2. Join the room
      setMeetingId(incomingCall.roomId)

      // 3. Clear the incoming call flag
      await updateDoc(doc(db, 'users', user.id), {
        incomingCall: null
      })
    } catch (err) {
      console.error('Error accepting call:', err)
      setError('Failed to join call')
    }
  }

  const handleDeclineCall = async () => {
    if (!user?.id) return
    try {
      await updateDoc(doc(db, 'users', user.id), {
        incomingCall: null
      })
      setIncomingCall(null)
    } catch (err) {
      console.error('Error declining call:', err)
    }
  }

  // If in a call, show the video component
  if (meetingId && token) {
    return (
      <div className="h-screen w-screen">
        <VideoCall
          meetingId={meetingId}
          token={token}
          redirectUrl={typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined}
          onMeetingLeft={() => {
            setMeetingId(null)
            setToken(null)
            // Also clear any lingering incoming call data just in case
            if (user?.id) updateDoc(doc(db, 'users', user.id), { incomingCall: null })
            fetchAvailableUsers()
          }}
        />
      </div>
    )
  }

  // Otherwise show the dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Incoming Call Modal */}
        {incomingCall && !meetingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Incoming Call</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                {incomingCall.callerName || 'Unknown User'} is calling you...
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleDeclineCall}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5 rotate-180" />
                  Decline
                </button>
                <button
                  onClick={handleAcceptCall}
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Video className="w-5 h-5" />
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          {/* Available Users Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Available Users
              </h2>
              <button
                onClick={fetchAvailableUsers}
                disabled={loadingUsers}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {loadingUsers ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading available users...</p>
              </div>
            ) : availableUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableUsers.map((availableUser) => (
                  <div
                    key={availableUser.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {availableUser.username}
                        </h3>
                        <p className="text-sm text-gray-400">{availableUser.gender}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${availableUser.is_available ? 'bg-green-500' : 'bg-gray-500'
                        }`}></div>
                    </div>
                    <button
                      onClick={() => handleStartCall(availableUser.id)}
                      disabled={loading || !availableUser.is_available}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Talk to {availableUser.username}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-200 mb-2">No Users Available Right Now</h3>
                <p className="text-gray-400 mb-4">
                  Don&apos;t worry! You can wait here and we&apos;ll automatically show you when other users come online.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  The list will refresh automatically, or you can click the refresh button above.
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Waiting for users to connect...</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>Logged in as: {user.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
