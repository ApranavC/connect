/**
 * Utility functions for VideoSDK room creation
 */

export interface CreateRoomResponse {
  roomId: string
  customRoomId?: string
  userId: string
  disabled: boolean
  createdAt: string
  updatedAt: string
  id: string
  links: {
    get_room: string
    get_session: string
  }
}

/**
 * Create a VideoSDK room with 10-minute auto-close configuration
 */
export async function createVideoRoom(
  token: string,
  customRoomId?: string
): Promise<CreateRoomResponse> {
  const response = await fetch('https://api.videosdk.live/v2/rooms', {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customRoomId,
      autoCloseConfig: {
        type: 'session-end-and-deactivate',
        duration: 10, // 10 minutes
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create room' }))
    throw new Error(error.message || 'Failed to create room')
  }

  return response.json()
}

