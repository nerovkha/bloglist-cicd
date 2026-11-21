import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'http://example.com/testing',
  likes: 7,
  user: { username: 'tester', name: 'Test User' },
}

test('renders title and author, but not url or likes by default', () => {
  render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />)

  expect(screen.getByText(/Component testing is done with react-testing-library/)).toBeDefined()
  expect(screen.getByText(/Test Author/)).toBeDefined()
  expect(screen.queryByText(/example\.com/)).toBeNull()
  expect(screen.queryByText(/likes 7/)).toBeNull()
})

test('renders url and likes after pressing the view button', async () => {
  render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />)

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))

  expect(screen.getByText(/example\.com/)).toBeDefined()
  expect(screen.getByText(/likes 7/)).toBeDefined()
})

test('calls the like handler twice when the like button is clicked twice', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} onLike={mockHandler} onDelete={() => {}} />)

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))
  const likeButton = screen.getByTestId('like-button')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})

test('the single blog view renders all details', () => {
  render(
    <Blog
      blog={blog}
      loggedUsername="tester"
      onLike={() => {}}
      onDelete={() => {}}
      alwaysExpanded
    />
  )

  expect(screen.getByText(/Component testing is done with react-testing-library/)).toBeDefined()
  expect(screen.getByText(/example\.com/)).toBeDefined()
  expect(screen.getByText(/likes 7/)).toBeDefined()
  expect(screen.getByTestId('remove-button')).toBeDefined()
})
