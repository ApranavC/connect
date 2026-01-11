import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthContext'

export const metadata: Metadata = {
  title: 'Connect - Video Chat Platform',
  description: 'Connect with people through 1-on-1 video calls',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

