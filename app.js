import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import tokenExtractor from './middleware/tokenExtractor.js'
import errorHandler from './middleware/errorHandler.js'
import Blog from './models/blog.js'
import User from './models/user.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'frontend', 'dist')
const hasFrontendBuild = fs.existsSync(path.join(dist, 'index.html'))

const app = express()

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

if (hasFrontendBuild) {
  app.use(express.static(dist))
}

app.get('/health', (request, response) => {
  response.send('ok')
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = express.Router()
  testingRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
  })
  app.use('/api/testing', testingRouter)
}

// client-side routes (/login, /blogs/:id, ...) all load the SPA
if (hasFrontendBuild) {
  app.use((request, response, next) => {
    if (request.method === 'GET' && !request.path.startsWith('/api')) {
      return response.sendFile(path.join(dist, 'index.html'))
    }
    next()
  })
}

app.use(errorHandler)

export default app
