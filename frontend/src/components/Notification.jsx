import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useNotification } from '../notification'

const Notification = () => {
  const { notification } = useNotification()

  if (!notification) {
    return null
  }

  return (
    <Snackbar open autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert
        severity={notification.kind === 'error' ? 'error' : 'success'}
        variant="filled"
        sx={{ width: '100%' }}
        data-testid="notification"
      >
        {notification.message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
