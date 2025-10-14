import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { updateVotingSessionStatus, getVotingSessionById, deleteVotingSession, getVotesBySession } from '@/database/handler/voting'
import { unlink } from 'fs/promises'
import path from 'path'

interface Params {
  params: Promise<{
    id: string
  }>
}

// PATCH - Update voting session status
export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getSession()

    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const sessionId = parseInt(id)

    if (isNaN(sessionId)) {
      return NextResponse.json({ success: false, error: 'Invalid session ID' }, { status: 400 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['pending', 'active', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be: pending, active, or completed' },
        { status: 400 }
      )
    }

    const updated = await updateVotingSessionStatus(sessionId, status)

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Voting session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data   : updated,
      message: 'Voting session status updated successfully',
    })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update voting session' },
      { status: 500 }
    )
  }
}

// DELETE - Delete voting session with vote count adjustment and image cleanup
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getSession()

    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const sessionId = parseInt(id)

    if (isNaN(sessionId)) {
      return NextResponse.json({ success: false, error: 'Invalid session ID' }, { status: 400 })
    }

    // Get session data before deletion for cleanup
    const sessionData = await getVotingSessionById(sessionId)
    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'Voting session not found' },
        { status: 404 }
      )
    }

    // Get vote count for this session
    const sessionVotes = await getVotesBySession(sessionId)
    const voteCount = sessionVotes.length

    // Clean up candidate images if they exist
    const deletedImages: string[] = []
    if (sessionData.candidates) {
      try {
        const candidates = JSON.parse(sessionData.candidates)
        for (const candidate of candidates) {
          if (candidate.photoUrl && candidate.photoUrl.startsWith('/uploads/candidates/')) {
            const filename = candidate.photoUrl.replace('/uploads/candidates/', '')
            const filePath = path.join(process.cwd(), 'public', 'uploads', 'candidates', filename)
            
            try {
              await unlink(filePath)
              deletedImages.push(filename)
            } catch (fileError) {
              console.warn(`Failed to delete image ${filename}:`, fileError)
            }
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse candidates for image cleanup:', parseError)
      }
    }

    // Delete the session (votes will be cascade deleted)
    const deleted = await deleteVotingSession(sessionId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete voting session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Voting session deleted successfully',
      data   : {
        deletedSessionId: sessionId,
        deletedVotes    : voteCount,
        deletedImages   : deletedImages,
      }
    })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete voting session' },
      { status: 500 }
    )
  }
}
