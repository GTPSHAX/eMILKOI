import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/database/schema/*',
  out: './dist/drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './dist/sqlite.db',
  },
  verbose: true,
  strict: true,
})
