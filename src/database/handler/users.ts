import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '../database'
import { users, type User, type NewUser } from '../schema/users'

/**
 * Create a new user
 */
export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning()
  return user
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  return await db.select().from(users)
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id))
  return user
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email))
  return user
}

/**
 * Update user by ID
 */
export async function updateUser(
  id: number,
  data: Partial<NewUser>
): Promise<User | undefined> {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()
  return updatedUser
}

/**
 * Delete user by ID
 */
export async function deleteUser(id: number): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id))
  return result.changes > 0
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: 'admin' | 'voter'): Promise<User[]> {
  return await db.select().from(users).where(eq(users.role, role))
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/**
 * Authenticate user
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)
  if (!user) return null
  
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null
  
  return user
}
