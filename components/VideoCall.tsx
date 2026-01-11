'use client'

import { useEffect, useState } from 'react'

interface VideoCallProps {
  meetingId: string
  token: string
  onMeetingLeft?: () => void
  redirectUrl?: string
}

export function VideoCall({ meetingId, token, onMeetingLeft, redirectUrl }: VideoCallProps) {
  const [meetingUrl, setMeetingUrl] = useState('')

  useEffect(() => {
    if (!meetingId || !token) return

    const name = 'User' // Could be passed as prop later
    const finalRedirectUrl = redirectUrl || (typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '')

    const params = new URLSearchParams({
      name: name,
      meetingId: meetingId,
      token: token,
      micEnabled: "true",
      webcamEnabled: "true",
      participantCanToggleSelfWebcam: "true",
      participantCanToggleSelfMic: "true",
      chatEnabled: "true",
      screenShareEnabled: "true",
      joinWithoutUserInteraction: "true",
      redirectOnLeave: finalRedirectUrl,
    })

    const url = `https://embed.videosdk.live/rtc-js-prebuilt/0.3.43/?${params.toString()}`
    setMeetingUrl(url)
  }, [meetingId, token, redirectUrl])

  if (!meetingUrl) return <div className="w-full h-screen bg-black flex items-center justify-center text-white">Loading Video Call...</div>

  return (
    <div className="w-full h-screen bg-black">
      <iframe
        src={meetingUrl}
        allow="camera; microphone; fullscreen; display-capture; clipboard-read; clipboard-write"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        title="Video Call"
      />
    </div>
  )
}
