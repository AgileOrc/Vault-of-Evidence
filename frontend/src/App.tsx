import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import SignUp from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import EmailSent from './pages/EmailSent'
import AppLayout from './components/AppLayout'
import CreateNewPassword from './pages/CreateNewPassword'
import NewProject from './pages/NewProject'
import Worklist from './pages/Worklist'
import Profile from './pages/UserProfile'
import CVSSCalculator from './pages/CVSSCalculator'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#F5F5F5]'>
        <p className='text-lg font-montserrat text-[#002C49]'>Loading...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to='/' replace />
  }

  return <>{children}</>
}

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Projects' element={<Projects />} />
        <Route path="/Projects/New" element={<NewProject />} />
        <Route path="/projects/:projectId/worklists" element={<Worklist />} />
        <Route path='/cvss' element={<CVSSCalculator />} />
        <Route path='/Profile' element={<Profile />} /> 
      </Route>
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/ResetPassword' element={<ResetPassword />} />
      <Route path='/EmailSent' element={<EmailSent />} />
      <Route path='/CreateNewPassword' element={<CreateNewPassword />} />
    </Routes>
  )
}

export default App