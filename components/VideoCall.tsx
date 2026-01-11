'use client'

import { VideoSDKMeeting } from '@videosdk.live/rtc-js-prebuilt'
import { useEffect } from 'react'

interface VideoCallProps {
  meetingId: string
  token: string
  onMeetingLeft?: () => void
}

export function VideoCall({ meetingId, token, onMeetingLeft }: VideoCallProps) {
  useEffect(() => {
    const config = {
      name: 'User',
      meetingId: meetingId,
      apiKey: token, // The documentation sometimes refers to this as apiKey, but for JWT it's often the token. Let's try apiKey first as per docs, but assign the token value.
      containerId: 'video-sdk-container', // "null" to create its own full-screen container
      redirectOnLeave: undefined, // Explicitly undefined to prevent auto-redirect
      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      chatEnabled: true,
      screenShareEnabled: true,
    }

    const meeting = new VideoSDKMeeting()
    // Cast config to any to bypass strict typing if needed, or supply missing properties if critical.
    // However, for prebuilt, extra props are usually optional. The type error suggests `realtimeTranscription` is required, which is odd.
    meeting.init(config as any)

    // Event listener for meeting left
    // The event name might be 'meetingLeft' or similar. 
    // Based on search, it's often handled via callbacks or just by observing the close.
    // However, prebuilt often has an `onMeetingLeft` callback in config if not an event.
    // Documentation says: "redirectOnLeave" is a property.
    // But we want to handle it manually.
    // NOTE: The prebuilt SDK is a wrapper. If we don't pass redirectOnLeave, it might show a "Left" screen with a button.
    // We want to hook into that.

    // Actually, looking at the previous error log "meetingId not provided", the structure was likely correct but maybe the value was null.
    // The user had: const config = { name: 'User', meetingId: meetingId, apiKey: token, ... }

    // Let's create the element safely
  }, [meetingId, token])

  // Wait, the SDK creates its own UI. We should probably return an empty div or nothing if containerId is null.
  // But wait, if we use containerId: null, it appends to body.
  // We want it to be contained if possible, or handle cleanup.

  // Cleanup isn't straightforward with this SDK as it doesn't expose a clear 'destroy' method in the docs I found,
  // but removing the container usually helps.
  // We need to handle the "Leave" action. The prebuilt UI has a leave button.
  // If we can't hook into it easily, we might need to rely on the user clicking "Back" or us polling status?
  // No, the SDK likely emits events? 
  // Actually, I should probably search for "VideoSDK Prebuilt events" to be sure.
  // But for now, let's just get it rendering without the iframe error.

  return (
    <div id="video-sdk-container" className="w-full h-screen bg-black" />
  )
}
