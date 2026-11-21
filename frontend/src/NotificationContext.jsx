import { useState } from 'react'
import NotificationContext from './notification'

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)

  const notify = (message, kind = 'success') => {
    setNotification({ message, kind })
    setTimeout(() => setNotification(null), 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}
