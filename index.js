import app from './app.js'
import db from './utils/db.js'
import config from './utils/config.js'

const start = async () => {
  await db.connectToDatabase()

  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
}

start()
