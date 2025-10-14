import { NextResponse } from 'next/server'
import { getVotingSessionBySlug, createVote, hasEmailVoted } from '@/database/handler/voting'

// GET - Get voting session by slug (public access)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const session = await getVotingSessionBySlug(slug)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Voting session not found' },
        { status: 404 }
      )
    }

    // Only allow access to active sessions for voting
    if (session.status !== 'active') {
      let message = 'Voting session is not available'
      if (session.status === 'pending') {
        message = 'Voting has not started yet'
      } else if (session.status === 'completed') {
        message = 'Voting has ended'
      }
      
      return NextResponse.json(
        { success: false, error: message, status: session.status },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        title: session.title,
        description: session.description,
        slug: session.slug,
        candidates: session.candidates,
        options: session.options,
        startDate: session.startDate,
        endDate: session.endDate,
      },
    })
  } catch (error) {
    console.error('Error fetching voting session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch voting session' },
      { status: 500 }
    )
  }
}

// POST - Submit vote (public access, no authentication required)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { candidate, voterName, voterEmail } = body

    // Validation
    if (!candidate || !voterName || !voterEmail) {
      return NextResponse.json(
        { success: false, error: 'Candidate, voter name, and email are required' },
        { status: 400 }
      )
    }

    // Get voting session
    const session = await getVotingSessionBySlug(slug)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Voting session not found' },
        { status: 404 }
      )
    }

    // Check if session is active
    if (session.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Voting is not currently active' },
        { status: 403 }
      )
    }

    // Note: No email duplicate check for kiosk voting
    // Each vote is treated as independent for single-device usage

    // Validate candidate exists in session
    let validCandidate = false
    
    if (session.candidates) {
      const candidates = JSON.parse(session.candidates)
      validCandidate = candidates.some((c: any) => c.name === candidate)
    } else if (session.options) {
      const options = JSON.parse(session.options)
      validCandidate = options.includes(candidate)
    }

    if (!validCandidate) {
      return NextResponse.json(
        { success: false, error: 'Invalid candidate selection' },
        { status: 400 }
      )
    }

    // Create vote
    const vote = await createVote({
      sessionId: session.id,
      candidate,
      voterName,
      voterEmail,
      userId: null, // No user authentication required
    })

    return NextResponse.json({
      success: true,
      data: vote,
      message: 'Vote submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}