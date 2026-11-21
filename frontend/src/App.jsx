import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotification } from './notification'
import Navbar from './components/Navbar'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

const Home = ({ user, blogs, likeBlog, deleteBlog, createBlog }) => {
  const sorted = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        blogs
      </Typography>
      <Togglable buttonLabel="new blog">
        <Typography variant="h6">create new</Typography>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {sorted.map((blog) => (
        <div key={blog.id} className="blog">
          <Blog
            blog={blog}
            loggedUsername={user?.username}
            onLike={likeBlog}
            onDelete={deleteBlog}
            linked
          />
        </div>
      ))}
    </div>
  )
}

const SingleBlogPage = ({ blogs, user, likeBlog }) => {
  const { id } = useParams()
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <Typography>blog not found</Typography>
  }

  return (
    <Blog
      blog={blog}
      loggedUsername={user?.username}
      onLike={likeBlog}
      onDelete={() => {}}
      alwaysExpanded
    />
  )
}

const CreatePage = ({ createBlog }) => {
  const navigate = useNavigate()

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        create new
      </Typography>
      <BlogForm
        createBlog={(blog) => {
          createBlog(blog)
          navigate('/')
        }}
      />
    </div>
  )
}

const LoginPage = ({ user, handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  if (user) {
    return <Navigate replace to="/" />
  }

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        log in to application
      </Typography>
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={async (event) => {
          event.preventDefault()
          const ok = await handleLogin(username, password)
          if (ok) {
            navigate('/')
          }
        }}
      />
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const { notify } = useNotification()

  const readLoggedUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedUserJSON) {
      return null
    }

    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return user
  }

  const [user, setUser] = useState(readLoggedUser)

  useEffect(() => {
    if (user) {
      blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs))
    }
  }, [user])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      notify(`welcome ${user.name}`)
      return true
    } catch {
      notify('wrong username or password', 'error')
      return false
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
  }

  const createBlog = (blog) => {
    blogService
      .create(blog)
      .then((created) => {
        setBlogs((previous) => previous.concat(created))
        notify(`a new blog ${created.title} by ${created.author} added`)
      })
      .catch(() => {
        notify('failed to create the blog', 'error')
      })
  }

  const likeBlog = (blog) => {
    const changed = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id ?? blog.user,
    }
    blogService
      .update(blog.id, changed)
      .then((updated) => {
        setBlogs((previous) =>
          previous.map((b) => (b.id !== updated.id ? b : { ...b, likes: updated.likes }))
        )
      })
      .catch(() => {
        notify('failed to like the blog', 'error')
      })
  }

  const deleteBlog = (blog) => {
    blogService
      .remove(blog.id)
      .then(() => {
        setBlogs((previous) => previous.filter((b) => b.id !== blog.id))
        notify(`removed ${blog.title}`)
      })
      .catch(() => {
        notify('failed to remove the blog', 'error')
      })
  }

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/login" element={<LoginPage user={user} handleLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            user ? (
              <Home
                user={user}
                blogs={blogs}
                likeBlog={likeBlog}
                deleteBlog={deleteBlog}
                createBlog={createBlog}
              />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/new"
          element={
            user ? (
              <CreatePage createBlog={createBlog} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/blogs/:id"
          element={
            user ? (
              <SingleBlogPage blogs={blogs} user={user} likeBlog={likeBlog} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
      </Routes>
    </Container>
  )
}

export default App
