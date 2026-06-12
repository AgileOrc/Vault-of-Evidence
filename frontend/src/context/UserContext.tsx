import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

type User = {
  username: string
  email: string
  nickname: string
  address: string
  contactNumber: string
}

type UserContextType = {
  user: User
  isLoggedIn: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setIsLoggedIn: (val: boolean) => void
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: { username: 'User', email: '', nickname: '', address: '', contactNumber: '' },
  isLoggedIn: false,
  isLoading: true,
  setUser: () => {},
  setIsLoggedIn: () => {},
  refreshUser: async () => {},
  logout: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ username: 'User', email: '', nickname: '', address: '', contactNumber: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser({
        username: res.data.username,
        email: res.data.email,
        nickname: res.data.nickname || '',
        address: res.data.address || '',
        contactNumber: res.data.contact_number || '',
      })
      setIsLoggedIn(true)
    } catch {
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch { /* ignore */ }
    localStorage.removeItem('voe_token')
    setIsLoggedIn(false)
    setUser({ username: 'User', email: '', nickname: '', address: '', contactNumber: '' })
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoggedIn, isLoading, setUser, setIsLoggedIn, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
