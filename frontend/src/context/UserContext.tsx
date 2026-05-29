import { createContext, useContext, useEffect, useState } from 'react'

type User = {
  name: string
  email: string
}

type UserContextType = {
  user: User
}

const UserContext = createContext<UserContextType>({
  user: { name: 'User', email: '' }
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ name: 'User', email: '' })

  useEffect(() => {
    fetch('http://localhost:8080/api/me', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUser({ name: data.name, email: data.email }))
      .catch(() => {})
  }, [])

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}