import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import config from './config.js'

let memoryServer = null

const connectToDatabase = async () => {
  let uri = config.MONGODB_URI

  if (!uri) {
    if (config.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI must be set in production')
    }

    memoryServer = await MongoMemoryServer.create()
    uri = memoryServer.getUri('bloglist')
    console.log('no MONGODB_URI configured, using an in-memory database')
  }

  await mongoose.connect(uri)
  console.log('connected to', config.MONGODB_URI ? 'MongoDB' : 'in-memory MongoDB')
}

const disconnectFromDatabase = async () => {
  await mongoose.connection.close()
  if (memoryServer) {
    await memoryServer.stop()
  }
}

export default { connectToDatabase, disconnectFromDatabase }
