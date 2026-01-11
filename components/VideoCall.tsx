'use client'




interface VideoCallProps {
  meetingId: string
  token: string
  onMeetingLeft?: () => void
}

export function VideoCall({ meetingId, token, onMeetingLeft }: VideoCallProps) {
  // Use a fallback meeting ID if none is provided, or ensure it's generated before this component is rendered.
  // The user suggested generating one or using a random one if needed.
  // For now, we assume meetingId is valid or handled by the parent. 

  // Construct the embed URL
  // Using version 0.3.43 as requested in the example
  // Ensure redirect URL is encoded
  const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : ''
  const embedUrl = `https://embed.videosdk.live/rtc-js-prebuilt/0.3.43/?name=User&meetingId=${meetingId || 'test-room'}&token=${token}&joinWithoutUserInteraction=true&redirectOnLeave=${encodeURIComponent(redirectUrl)}`

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <iframe
        src={embedUrl}
        allow="camera; microphone; fullscreen; display-capture"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        title="Video Call"
      />
    </div>
  )
}
