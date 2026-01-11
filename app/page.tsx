import Link from 'next/link'
import { Video, Users, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Connect
          </h1>
          <p className="text-2xl text-gray-300 mb-12">
            Connect with people through seamless 1-on-1 video calls
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Video className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">HD Video Calls</h3>
              <p className="text-gray-400">
                Crystal clear video quality for meaningful conversations
              </p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Easy Matching</h3>
              <p className="text-gray-400">
                Connect with people instantly with our smart matching system
              </p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-400">
                Your conversations are encrypted and secure
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

