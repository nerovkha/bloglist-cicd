import { test, expect } from '@playwright/test'
import {
  createUser,
  loginViaUi,
  resetDatabase,
  seedUserAndBlogs,
} from './helpers'

test.describe('bloglist', () => {
  test.beforeEach(async () => {
    await resetDatabase()
    await createUser('testuser', 'Test User', 'testpass')
  })

  test('login form is shown', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await loginViaUi(page, 'testuser', 'testpass')

    await expect(page.getByTestId('logged-user')).toHaveText('Test User logged in')
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('username-input').fill('testuser')
    await page.getByTestId('password-input').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByTestId('notification')).toContainText('wrong username or password')
    await expect(page.getByTestId('logged-user')).toHaveCount(0)
  })

  test('a logged in user can create a blog', async ({ page }) => {
    await loginViaUi(page, 'testuser', 'testpass')

    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title-input').fill('A blog created by e2e')
    await page.getByTestId('author-input').fill('Playwright')
    await page.getByTestId('url-input').fill('http://example.com/e2e')
    await page.getByRole('button', { name: 'create' }).click()

    await expect(page.getByText('A blog created by e2e Playwright')).toBeVisible()
    await expect(page.getByTestId('notification')).toContainText(
      'a new blog A blog created by e2e by Playwright added'
    )
  })

  test('a blog can be liked', async ({ page }) => {
    await seedUserAndBlogs()
    await loginViaUi(page, 'testuser', 'testpass')

    const blog = page.locator('.blog', { hasText: 'First class tests' })
    await blog.getByRole('button', { name: 'view' }).click()

    await expect(blog.getByText('likes 10')).toBeVisible()
    await blog.getByTestId('like-button').click()
    await expect(blog.getByText('likes 11')).toBeVisible()
  })

  test('the user who created a blog can delete it', async ({ page }) => {
    await seedUserAndBlogs()
    await loginViaUi(page, 'testuser', 'testpass')

    const blog = page.locator('.blog', { hasText: 'Canonical string reduction' })
    await blog.getByRole('button', { name: 'view' }).click()

    page.on('dialog', (dialog) => dialog.accept())
    await blog.getByTestId('remove-button').click()

    await expect(page.locator('.blog', { hasText: 'Canonical string reduction' })).toHaveCount(0)
  })

  test('only the creator sees the remove button', async ({ page }) => {
    await seedUserAndBlogs()
    await createUser('otheruser', 'Other User', 'otherpass')
    await loginViaUi(page, 'otheruser', 'otherpass')

    const blog = page.locator('.blog', { hasText: 'First class tests' })
    await blog.getByRole('button', { name: 'view' }).click()

    await expect(blog.getByText('likes 10')).toBeVisible()
    await expect(blog.getByTestId('remove-button')).toHaveCount(0)
  })

  test('blogs are sorted by likes in descending order', async ({ page }) => {
    await seedUserAndBlogs()
    await loginViaUi(page, 'testuser', 'testpass')

    const titles = page.locator('[data-testid="blog-title"]')
    await expect(titles).toHaveCount(2)
    await expect(titles.first()).toContainText('Canonical string reduction')
    await expect(titles.nth(1)).toContainText('First class tests')

    const firstClassBlog = page.locator('.blog', { hasText: 'First class tests' })
    await firstClassBlog.getByRole('button', { name: 'view' }).click()
    await firstClassBlog.getByTestId('like-button').click()
    await expect(firstClassBlog.getByText('likes 11')).toBeVisible()
    await firstClassBlog.getByTestId('like-button').click()
    await expect(firstClassBlog.getByText('likes 12')).toBeVisible()
    await firstClassBlog.getByTestId('like-button').click()
    await expect(firstClassBlog.getByText('likes 13')).toBeVisible()

    await expect(titles.first()).toContainText('First class tests')
  })

  test('a single blog route shows details and allows liking', async ({ page }) => {
    await seedUserAndBlogs()
    await loginViaUi(page, 'testuser', 'testpass')

    await page.locator('.blog', { hasText: 'First class tests' }).getByRole('link').click()
    await expect(page.getByRole('heading', { name: /First class tests/ })).toBeVisible()
    await page.getByTestId('like-button').click()
    await expect(page.getByText('likes 11')).toBeVisible()
  })
})
