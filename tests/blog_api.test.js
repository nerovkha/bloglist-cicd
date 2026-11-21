import { after, before, beforeEach, test } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app.js'
import db from '../utils/db.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const api = supertest(app)

let authToken = null

before(async () => {
  await db.connectToDatabase()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = new User({ username: 'root', name: 'Root User' })
  await user.setPassword('sekret')
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  authToken = loginResponse.body.token

  const blogs = [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: user._id,
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/csc533/high_performing_java_script.html',
      likes: 5,
      user: user._id,
    },
  ]

  await Blog.insertMany(blogs)
})

test('blogs are returned as json with correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 2)
})

test('blogs have an id property instead of _id', async () => {
  const response = await api.get('/api/blogs')

  for (const blog of response.body) {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  }
})

test('a valid blog can be added with a token', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 3)

  const titles = response.body.map((blog) => blog.title)
  assert.ok(titles.includes('Canonical string reduction'))
})

test('a blog without a token is rejected with 401', async () => {
  const newBlog = {
    title: 'Unauthorized post',
    author: 'Nobody',
    url: 'http://example.com',
  }

  await api.post('/api/blogs').send(newBlog).expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 2)
})

test('likes default to zero when not given', async () => {
  const newBlog = {
    title: 'Default likes',
    author: 'Someone',
    url: 'http://example.com/likes',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('a blog without title or url is rejected with 400', async () => {
  const noTitle = {
    author: 'Someone',
    url: 'http://example.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(noTitle)
    .expect(400)

  const noUrl = {
    title: 'No url',
    author: 'Someone',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(noUrl)
    .expect(400)
})

test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, 1)

  const titles = blogsAtEnd.body.map((blog) => blog.title)
  assert.strictEqual(titles.includes(blogToDelete.title), false)
})

test('a blog cannot be deleted by another user', async () => {
  const otherUser = new User({ username: 'other', name: 'Other User' })
  await otherUser.setPassword('otherpass')
  await otherUser.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'other', password: 'otherpass' })

  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(403)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length)
})

test('a blog likes can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ ...blogToUpdate, likes: 100 })
    .expect(200)

  assert.strictEqual(response.body.likes, 100)
})

test('a blog has its creator populated', async () => {
  const response = await api.get('/api/blogs')

  for (const blog of response.body) {
    assert.strictEqual(blog.user.username, 'root')
  }
})

after(async () => {
  await db.disconnectFromDatabase()
})
