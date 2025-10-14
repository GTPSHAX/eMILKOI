import { NextResponse } from 'next/server'
import { getSession, defaultSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()

    if (!session.isLoggedIn) {
      return NextResponse.json({ user: defaultSession })
    }

    return NextResponse.json({
      user: {
        userId    : session.userId,
        email     : session.email,
        name      : session.name,
        role      : session.role,
        isLoggedIn: session.isLoggedIn,
      },
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: defaultSession })
  }
}
