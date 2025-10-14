import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDashboardStats, autoUpdateSessionStatuses } from '@/database/handler/voting'

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getSession()

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Auto-update session statuses before fetching stats
    await autoUpdateSessionStatuses()

    // Get dashboard statistics
    const stats = await getDashboardStats()

    return NextResponse.json({
      success: true,
      data   : stats,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
