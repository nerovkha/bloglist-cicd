import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({ title, author, url, likes: 0 })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 1 } }}>
      <div>
        <TextField
          label="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          id="title-input"
          slotProps={{ htmlInput: { 'data-testid': 'title-input' } }}
        />
      </div>
      <div>
        <TextField
          label="author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          id="author-input"
          slotProps={{ htmlInput: { 'data-testid': 'author-input' } }}
        />
      </div>
      <div>
        <TextField
          label="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          id="url-input"
          slotProps={{ htmlInput: { 'data-testid': 'url-input' } }}
        />
      </div>
      <Button variant="contained" type="submit" id="create-button">
        create
      </Button>
    </Box>
  )
}

export default BlogForm
