import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId: number
  email: string
  name: string
  role: 'admin' | 'voter'
  isLoggedIn: boolean
}

const sessionOptions = {
  password     : process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_security',
  cookieName   : 'emilkoi_session',
  cookieOptions: {
    secure  : process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge  : 60 * 60 * 24 * 7, // 7 days
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export const defaultSession: SessionData = {
  userId    : 0,
  email     : '',
  name      : '',
  role      : 'voter',
  isLoggedIn: false,
}
