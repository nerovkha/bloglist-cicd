import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import config from '../utils/config.js'

const loginRouter = Router()

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body

  try {
    const user = await User.findOne({ username })

    const passwordCorrect =
      user === null ? false : await user.checkPassword(password)

    if (!passwordCorrect) {
      return response.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, config.SECRET)

    response.status(200).send({ token, username: user.username, name: user.name })
  } catch (error) {
    next(error)
  }
})

export default loginRouter
