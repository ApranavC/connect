# Connect - Video Chat Platform

A modern web platform for 1-on-1 video calls built with Next.js, Firebase, and VideoSDK.

## Features

- 🔐 **Authentication**: Email/password authentication with Firebase Auth
- 📹 **Video Calls**: HD video calls using VideoSDK Prebuilt SDK
- ⏱️ **Auto-Close Sessions**: Rooms automatically close after 10 minutes
- 🎨 **Modern UI**: Dark mode interface with Tailwind CSS
- 🔒 **Secure**: Token generation handled via Next.js API Routes (JWT)

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend/Auth**: Firebase (Auth & Firestore)
- **Functions**: Next.js API Routes
- **Video**: VideoSDK Prebuilt SDK

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project
- A VideoSDK account

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# VideoSDK Configuration
VIDEO_SDK_API_KEY=your_videosdk_api_key
VIDEO_SDK_SECRET=your_videosdk_secret
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema (Firestore)

**Collection: `users`**
- `id` (Document ID): User UID
- `email`: string
- `gender`: 'Male' | 'Female'
- `is_available`: boolean
- `created_at`: ISO timestamp
- `updated_at`: ISO timestamp

## Project Structure

```
connect/
├── app/
│   ├── api/
│   │   └── video-token/  # Token generation API
│   ├── auth/
│   ├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── DashboardContent.tsx
│   └── VideoCall.tsx
├── utils/
│   ├── firebase/         # Firebase config & helpers
│   └── videosdk.ts
└── ...
```

## License

MIT

