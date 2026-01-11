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
export async function createVideoRoom(token: string): Promise<CreateRoomResponse> {
  const response = await fetch('https://api.videosdk.live/v2/rooms', {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), // Send empty object for default params
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create room' }))
    throw new Error(error.message || 'Failed to create room')
  }

  return response.json()
}

