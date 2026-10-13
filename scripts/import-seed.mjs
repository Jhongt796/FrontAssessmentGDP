import { readFileSync } from 'node:fs'
import { MongoClient, BSON } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI is not set. Define it in .env (see .env.example).')
  process.exit(1)
}

const client = new MongoClient(uri)
await client.connect()
const db = client.db()

for (const name of ['customers', 'products', 'sells']) {
  const docs = BSON.EJSON.parse(readFileSync(new URL(`../data/${name}.ejson`, import.meta.url), 'utf8'))
  await db.collection(name).deleteMany({})
  await db.collection(name).insertMany(docs)
  console.log(`${name}: ${await db.collection(name).countDocuments()} docs`)
}

await db.collection('sells').createIndex({ customerId: 1 })
await db.collection('sells').createIndex({ productId: 1 })
await db.collection('sells').createIndex({ date: -1 })

console.log('indexes created')
await client.close()
