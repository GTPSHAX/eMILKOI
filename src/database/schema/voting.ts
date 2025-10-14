import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const votingSessions = sqliteTable('voting_sessions', {
  id         : integer('id').primaryKey({ autoIncrement: true }),
  title      : text('title').notNull(),
  description: text('description'),
  slug       : text('slug').unique().notNull(), // URL slug for voting page
  status     : text('status', { enum: ['pending', 'active', 'completed'] }).notNull().default('pending'),
  options    : text('options').notNull(), // JSON string of simple options (backward compatible)
  candidates : text('candidates'), // JSON string of detailed candidate info: [{name, class, description, photoUrl}]
  startDate  : integer('start_date', { mode: 'timestamp' }),
  endDate    : integer('end_date', { mode: 'timestamp' }),
  createdBy  : integer('created_by').notNull().references(() => users.id),
  createdAt  : integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
})

export const votes = sqliteTable('votes', {
  id        : integer('id').primaryKey({ autoIncrement: true }),
  sessionId : integer('session_id').notNull().references(() => votingSessions.id),
  userId    : integer('user_id').references(() => users.id),
  voterEmail: text('voter_email'),
  voterName : text('voter_name'),
  candidate : text('candidate').notNull(),
  createdAt : integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

// Import users for foreign key reference
import { users } from './users'

export type VotingSession = typeof votingSessions.$inferSelect
export type NewVotingSession = typeof votingSessions.$inferInsert
export type Vote = typeof votes.$inferSelect
export type NewVote = typeof votes.$inferInsert
