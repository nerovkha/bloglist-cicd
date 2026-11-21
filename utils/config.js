import 'dotenv/config'

const config = {
  MONGODB_URI:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_MONGODB_URI
      : process.env.MONGODB_URI,
  PORT: process.env.PORT || 3003,
  SECRET: process.env.SECRET || 'dev-secret',
  NODE_ENV: process.env.NODE_ENV,
}

export default config
