import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import EmailSent from './pages/EmailSent'
import AppLayout from './components/AppLayout'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/ResetPassword' element={<ResetPassword />} />
      <Route path='/EmailSent' element={<EmailSent />} />
    </Routes>
  )
}

export default App