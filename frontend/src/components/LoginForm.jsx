import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => (
  <Box component="form" onSubmit={handleLogin} sx={{ '& .MuiTextField-root': { mb: 1 } }}>
    <div>
      <TextField
        label="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        id="username-input"
        slotProps={{ htmlInput: { 'data-testid': 'username-input' } }}
      />
    </div>
    <div>
      <TextField
        label="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        id="password-input"
        slotProps={{ htmlInput: { 'data-testid': 'password-input' } }}
      />
    </div>
    <Button variant="contained" type="submit" id="login-button">
      login
    </Button>
  </Box>
)

export default LoginForm
