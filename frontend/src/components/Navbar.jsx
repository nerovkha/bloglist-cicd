import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate()

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Button color="inherit" component={RouterLink} to="/">
          blogs
        </Button>
        <Button color="inherit" component={RouterLink} to="/new">
          create
        </Button>
        <div style={{ flexGrow: 1 }} />
        {user ? (
          <>
            <span data-testid="logged-user">{user.name} logged in</span>
            <Button
              color="inherit"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
