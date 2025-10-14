import { eq, and, count } from 'drizzle-orm'
import { db } from '../database'
import { votingSessions, votes, type VotingSession, type NewVotingSession, type Vote, type NewVote } from '../schema/voting'

// ============ Voting Sessions ============

/**
 * Create a new voting session
 */
export async function createVotingSession(data: NewVotingSession): Promise<VotingSession> {
  const [session] = await db.insert(votingSessions).values(data).returning()
  return session
}

/**
 * Get all voting sessions
 */
export async function getAllVotingSessions(): Promise<VotingSession[]> {
  return await db.select().from(votingSessions)
}

/**
 * Auto-update session status based on current time
 * - pending → active if current time >= startDate
 * - active → completed if current time >= endDate
 */
export async function autoUpdateSessionStatuses(): Promise<number> {
  const now = Date.now()
  let updatedCount = 0

  // Update pending sessions to active if start date has passed
  const pendingSessions = await db
    .select()
    .from(votingSessions)
    .where(eq(votingSessions.status, 'pending'))

  for (const session of pendingSessions) {
    if (session.startDate && new Date(session.startDate).getTime() <= now) {
      await updateVotingSessionStatus(session.id, 'active')
      updatedCount++
    }
  }

  // Update active sessions to completed if end date has passed
  const activeSessions = await db
    .select()
    .from(votingSessions)
    .where(eq(votingSessions.status, 'active'))

  for (const session of activeSessions) {
    if (session.endDate && new Date(session.endDate).getTime() <= now) {
      await updateVotingSessionStatus(session.id, 'completed')
      updatedCount++
    }
  }

  return updatedCount
}

/**
 * Get voting session by ID
 */
export async function getVotingSessionById(id: number): Promise<VotingSession | undefined> {
  const [session] = await db.select().from(votingSessions).where(eq(votingSessions.id, id))
  return session
}

/**
 * Get voting session by slug
 */
export async function getVotingSessionBySlug(slug: string): Promise<VotingSession | undefined> {
  const [session] = await db.select().from(votingSessions).where(eq(votingSessions.slug, slug))
  return session
}

/**
 * Check if slug exists
 */
export async function doesSlugExist(slug: string): Promise<boolean> {
  const [result] = await db
    .select({ count: count() })
    .from(votingSessions)
    .where(eq(votingSessions.slug, slug))
  return (result?.count || 0) > 0
}

/**
 * Get voting sessions by status
 */
export async function getVotingSessionsByStatus(status: 'pending' | 'active' | 'completed'): Promise<VotingSession[]> {
  return await db.select().from(votingSessions).where(eq(votingSessions.status, status))
}

/**
 * Update voting session
 */
export async function updateVotingSession(
  id: number,
  data: Partial<NewVotingSession>
): Promise<VotingSession | undefined> {
  const [updatedSession] = await db
    .update(votingSessions)
    .set(data)
    .where(eq(votingSessions.id, id))
    .returning()
  return updatedSession
}

/**
 * Update voting session status
 */
export async function updateVotingSessionStatus(
  id: number,
  status: 'pending' | 'active' | 'completed'
): Promise<VotingSession | undefined> {
  return await updateVotingSession(id, { status })
}

/**
 * Delete voting session and all related votes
 */
export async function deleteVotingSession(id: number): Promise<boolean> {
  // First delete all votes for this session
  await db.delete(votes).where(eq(votes.sessionId, id))
  
  // Then delete the session
  const result = await db.delete(votingSessions).where(eq(votingSessions.id, id))
  return result.changes > 0
}

/**
 * Delete all votes for a session
 */
export async function deleteVotesBySession(sessionId: number): Promise<number> {
  const result = await db.delete(votes).where(eq(votes.sessionId, sessionId))
  return result.changes
}

// ============ Votes ============

/**
 * Create a new vote
 */
export async function createVote(data: NewVote): Promise<Vote> {
  const [vote] = await db.insert(votes).values(data).returning()
  return vote
}

/**
 * Get all votes for a session
 */
export async function getVotesBySession(sessionId: number): Promise<Vote[]> {
  return await db.select().from(votes).where(eq(votes.sessionId, sessionId))
}

/**
 * Get vote count for a session
 */
export async function getVoteCountBySession(sessionId: number): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(votes)
    .where(eq(votes.sessionId, sessionId))
  return result?.count || 0
}

/**
 * Check if user has voted in a session
 */
export async function hasUserVoted(sessionId: number, userId: number): Promise<boolean> {
  const [result] = await db
    .select({ count: count() })
    .from(votes)
    .where(and(eq(votes.sessionId, sessionId), eq(votes.userId, userId)))
  return (result?.count || 0) > 0
}

/**
 * Check if email has voted in a session
 */
export async function hasEmailVoted(sessionId: number, email: string): Promise<boolean> {
  const [result] = await db
    .select({ count: count() })
    .from(votes)
    .where(and(eq(votes.sessionId, sessionId), eq(votes.voterEmail, email)))
  return (result?.count || 0) > 0
}

// ============ Dashboard Statistics ============

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  // Get total sessions by status
  const [totalSessions] = await db.select({ count: count() }).from(votingSessions)
  const [activeSessions] = await db.select({ count: count() }).from(votingSessions).where(eq(votingSessions.status, 'active'))
  const [pendingSessions] = await db.select({ count: count() }).from(votingSessions).where(eq(votingSessions.status, 'pending'))
  const [completedSessions] = await db.select({ count: count() }).from(votingSessions).where(eq(votingSessions.status, 'completed'))
  
  // Get total votes
  const [totalVotes] = await db.select({ count: count() }).from(votes)

  return {
    totalSessions    : totalSessions?.count || 0,
    activeSessions   : activeSessions?.count || 0,
    pendingSessions  : pendingSessions?.count || 0,
    completedSessions: completedSessions?.count || 0,
    totalVotes       : totalVotes?.count || 0,
  }
}
