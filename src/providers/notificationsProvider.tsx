import { Dispatch, SetStateAction, createContext, useContext } from 'react'

import { genericSuspense } from '../components/helpers/SafeSuspense'
import useAelinNotifications, {
  ClearedNotifications,
  ParsedNotification,
} from '../hooks/aelin/useAelinNotifications'
import useLocalStorage from '../hooks/localStorage/useLocalStorage'

export type NotificationsContextType = {
  notifications: ParsedNotification[]
  clearedNotifications: ClearedNotifications
  errorNotification?: any
  hasMore: boolean
  nextPage: () => void
  setClearedNotifications: Dispatch<SetStateAction<ClearedNotifications>>
}

const NotificationsContext = createContext<NotificationsContextType>({} as any)

const NotificationsContextProvider: React.FC = ({ children }) => {
  const [clearedNotifications, setClearedNotifications] = useLocalStorage<ClearedNotifications>(
    'aelin-cleared-notifications',
    {},
  )
  const {
    data: notifications,
    error: errorNotification,
    hasMore,
    nextPage,
  } = useAelinNotifications(clearedNotifications)

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        clearedNotifications,
        setClearedNotifications,
        errorNotification,
        hasMore,
        nextPage,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export default genericSuspense(NotificationsContextProvider)

export function useNotifications(): NotificationsContextType {
  return useContext<NotificationsContextType>(NotificationsContext)
}
