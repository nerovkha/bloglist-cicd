import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import config from '../utils/config.js'

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  try {
    const decodedToken = jwt.verify(request.token, config.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token invalid' })
    }

    request.user = user
  } catch (error) {
    return next(error)
  }

  next()
}

export default userExtractor
