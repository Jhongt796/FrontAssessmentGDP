import { MongoClient } from 'mongodb'

let clientPromise: Promise<MongoClient> | null = null

function getClient(uri: string): Promise<MongoClient> {
  if (!clientPromise) clientPromise = new MongoClient(uri).connect()
  return clientPromise
}

export default defineEventHandler(async (event) => {
  const { mongoUri } = useRuntimeConfig()
  if (!mongoUri) {
    throw createError({ statusCode: 500, statusMessage: 'MONGODB_URI is not set. Define it in .env' })
  }

  const { limit } = getQuery(event)
  const n = Math.min(Math.max(Number(limit) || 50, 1), 500)

  const client = await getClient(mongoUri)
  const items = await client.db().collection('sells').find({}).limit(n).toArray()

  return { count: items.length, items }
})
