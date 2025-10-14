import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as usersSchema from './schema/users'
import * as votingSchema from './schema/voting'

const schema = { ...usersSchema, ...votingSchema }

// Create SQLite connection
const sqlite = new Database('./dist/sqlite.db')

// Enable WAL mode for better concurrent performance
sqlite.pragma('journal_mode = WAL')

// Create Drizzle instance
export const db = drizzle(sqlite, { schema })

// Export the raw SQLite instance for advanced operations if needed
export { sqlite }
