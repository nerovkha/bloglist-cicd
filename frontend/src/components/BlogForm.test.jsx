import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls createBlog with the right details when submitted', async () => {
  const createBlog = vi.fn()
  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()
  await user.type(screen.getByTestId('title-input'), 'Testing forms')
  await user.type(screen.getByTestId('author-input'), 'Form Tester')
  await user.type(screen.getByTestId('url-input'), 'http://example.com/forms')
  await user.click(screen.getByText('create'))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing forms',
    author: 'Form Tester',
    url: 'http://example.com/forms',
    likes: 0,
  })
})
