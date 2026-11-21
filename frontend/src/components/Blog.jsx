import { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

const BlogDetails = ({ blog, loggedUsername, onLike, onDelete }) => (
  <div>
    <Typography>
      <MuiLink href={blog.url}>{blog.url}</MuiLink>
    </Typography>
    <Typography>
      likes {blog.likes}{' '}
      <Button
        size="small"
        variant="contained"
        data-testid="like-button"
        onClick={() => onLike(blog)}
      >
        like
      </Button>
    </Typography>
    {blog.user && (
      <Typography>added by {blog.user.name ?? blog.user.username}</Typography>
    )}
    {loggedUsername && blog.user && blog.user.username === loggedUsername && (
      <Button
        size="small"
        color="error"
        variant="outlined"
        data-testid="remove-button"
        onClick={() => {
          if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            onDelete(blog)
          }
        }}
      >
        remove
      </Button>
    )}
  </div>
)

const Title = ({ blog, linked }) =>
  linked ? (
    <MuiLink component={RouterLink} to={`/blogs/${blog.id}`} data-testid="blog-title">
      {blog.title}
    </MuiLink>
  ) : (
    <Typography component="span" data-testid="blog-title">
      {blog.title} {blog.author}{' '}
    </Typography>
  )

const Blog = ({ blog, loggedUsername, onLike, onDelete, alwaysExpanded = false, linked = false }) => {
  const [visible, setVisible] = useState(alwaysExpanded)

  if (alwaysExpanded) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {blog.title} {blog.author}
          </Typography>
          <BlogDetails blog={blog} loggedUsername={loggedUsername} onLike={onLike} onDelete={onDelete} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Title blog={blog} linked={linked} />
        {linked && <Typography component="span"> {blog.author} </Typography>}
        <Button size="small" onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </Button>
        {visible && (
          <BlogDetails blog={blog} loggedUsername={loggedUsername} onLike={onLike} onDelete={onDelete} />
        )}
      </CardContent>
    </Card>
  )
}

export default Blog
