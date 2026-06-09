import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

type User = {
  name: string
  email: string
}

type UserContextType = {
  user: User
  isLoggedIn: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setIsLoggedIn: (val: boolean) => void
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: { name: 'User', email: '' },
  isLoggedIn: false,
  isLoading: true,
  setUser: () => {},
  setIsLoggedIn: () => {},
  refreshUser: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ name: 'User', email: 'mail@mail.com' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser({ name: res.data.name, email: res.data.email })
      setIsLoggedIn(true)
    } catch {
      // SET FALSE KALAU UDAH DEPLOYING
      setIsLoggedIn(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoggedIn, isLoading, setUser, setIsLoggedIn, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}