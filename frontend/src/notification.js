import { createContext, useContext } from 'react'

const NotificationContext = createContext(null)

export const useNotification = () => useContext(NotificationContext)

export default NotificationContext
