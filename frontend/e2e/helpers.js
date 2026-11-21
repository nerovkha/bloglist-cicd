const baseUrl = 'http://localhost:3003'

export const resetDatabase = async () => {
  await fetch(`${baseUrl}/api/testing/reset`, { method: 'POST' })
}

export const createUser = async (username, name, password) => {
  await fetch(`${baseUrl}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, name, password }),
  })
}

export const createBlogViaApi = async (token, blog) => {
  await fetch(`${baseUrl}/api/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(blog),
  })
}

export const login = async (username, password) => {
  const response = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return response.json()
}

export const loginViaUi = async (page, username, password) => {
  await page.goto('/login')
  await page.getByTestId('username-input').fill(username)
  await page.getByTestId('password-input').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByTestId('logged-user').waitFor()
}

export const seedUserAndBlogs = async () => {
  await resetDatabase()
  await createUser('testuser', 'Test User', 'testpass')

  const { token } = await login('testuser', 'testpass')

  await createBlogViaApi(token, {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/first-class-tests',
    likes: 10,
  })
  await createBlogViaApi(token, {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  })
}
