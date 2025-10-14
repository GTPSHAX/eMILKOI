import { createUser, getUserByEmail, hashPassword } from './src/database/handler/users'

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Check if admin already exists
    const existingAdmin = await getUserByEmail('admin@admin.com')

    if (existingAdmin) {
      console.log('✅ Admin account already exists')
      return
    }

    // Create admin account
    const hashedPassword = await hashPassword('admin123')
    
    const admin = await createUser({
      name    : 'Administrator',
      email   : 'admin@admin.com',
      password: hashedPassword,
      role    : 'admin',
    })

    console.log('✅ Admin account created successfully:')
    console.log('   Email:', admin.email)
    console.log('   Password: admin123')
    console.log('   Role:', admin.role)
    console.log('\n🎉 Database seeded successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
