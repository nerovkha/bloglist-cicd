import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { NotificationProvider } from './NotificationContext'
import Notification from './components/Notification'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    background: { default: '#f4f6f8' },
  },
})

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <NotificationProvider>
        <Notification />
        <App />
      </NotificationProvider>
    </BrowserRouter>
  </ThemeProvider>
)
