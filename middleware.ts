import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Since we are moving to client-side auth with Firebase, 
  // we can't easily check auth status in middleware without session cookies.
  // For this migration, we will rely on client-side protection (ProtectedRoute component).
  // You could implement Firebase Admin SDK session verification here if needed, 
  // but for now we'll keep it simple and just allow requests.

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
