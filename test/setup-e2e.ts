import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import 'dotenv/config'

const prisma = new PrismaClient()
const schemaId = randomUUID()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('No database url provided')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseUrl
  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
