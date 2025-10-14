import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import {
  createVotingSession,
  getAllVotingSessions,
  autoUpdateSessionStatuses,
  doesSlugExist,
} from '@/database/handler/voting'

// GET - Get all voting sessions
export async function GET() {
  try {
    const session = await getSession()

    if (!session.isLoggedIn) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Auto-update session statuses based on current time
    await autoUpdateSessionStatuses()

    const sessions = await getAllVotingSessions()

    return NextResponse.json({
      success: true,
      data   : sessions,
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

// POST - Create new voting session
export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, slug, startDate, endDate, options, candidates } = body

    // Validation
    if (!title || !description || !slug || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate either options or candidates
    const hasCandidates = candidates && Array.isArray(candidates) && candidates.length >= 2
    const hasOptions = options && Array.isArray(options) && options.length >= 2

    if (!hasCandidates && !hasOptions) {
      return NextResponse.json(
        { success: false, error: 'At least 2 candidates or options are required' },
        { status: 400 }
      )
    }

    // If candidates provided, validate structure
    if (hasCandidates) {
      for (const candidate of candidates) {
        if (!candidate.name || !candidate.class) {
          return NextResponse.json(
            { success: false, error: 'Candidate name and class are required' },
            { status: 400 }
          )
        }
      }
    }

    // Check if start date is before end date
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const slugExists = await doesSlugExist(slug)
    if (slugExists) {
      return NextResponse.json(
        { success: false, error: 'URL slug already exists. Please choose a different one.' },
        { status: 400 }
      )
    }

    // Create voting session
    const votingSession = await createVotingSession({
      title,
      description,
      slug,
      startDate : start,
      endDate   : end,
      options   : JSON.stringify(hasOptions ? options : candidates.map((c: { name: string }) => c.name)),
      candidates: hasCandidates ? JSON.stringify(candidates) : null,
      createdBy : session.userId,
    })

    return NextResponse.json({
      success: true,
      data   : votingSession,
      message: 'Voting session created successfully',
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create voting session' },
      { status: 500 }
    )
  }
}
