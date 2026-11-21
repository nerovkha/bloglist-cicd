import { after, before, beforeEach, test } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app.js'
import db from '../utils/db.js'
import User from '../models/user.js'

const api = supertest(app)

before(async () => {
  await db.connectToDatabase()
})

beforeEach(async () => {
  await User.deleteMany({})
})

test('users are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid user can be created', async () => {
  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.username, 'mluukkai')
  assert.strictEqual(response.body.passwordHash, undefined)
  assert.strictEqual(response.body.password, undefined)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('user creation fails with a too short username', async () => {
  const newUser = {
    username: 'ab',
    name: 'Too Short',
    password: 'salainen',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.ok(response.body.error.includes('shorter than the minimum'))
})

test('user creation fails with a too short password', async () => {
  const newUser = {
    username: 'validname',
    name: 'Valid Name',
    password: 'ab',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(response.body.error, 'password must be at least 3 characters long')
})

test('user creation fails with a non-unique username', async () => {
  const user = new User({ username: 'taken', name: 'Taken Name' })
  await user.setPassword('salainen')
  await user.save()

  const newUser = {
    username: 'taken',
    name: 'Someone Else',
    password: 'salainen',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.ok(response.body.error.includes('unique'))
})

test('a user has their blogs listed', async () => {
  const newUser = {
    username: 'blogger',
    name: 'Blog Person',
    password: 'salainen',
  }

  await api.post('/api/users').send(newUser).expect(201)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'blogger', password: 'salainen' })
    .expect(200)

  const newBlog = {
    title: 'A blog by blogger',
    author: 'Blog Person',
    url: 'http://example.com/blog',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/users')
  const created = response.body.find((u) => u.username === 'blogger')

  assert.strictEqual(created.blogs.length, 1)
  assert.strictEqual(created.blogs[0].title, 'A blog by blogger')
})

after(async () => {
  await db.disconnectFromDatabase()
})
