import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import EmailSent from './pages/EmailSent'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/Dashboard' element={<Dashboard />} />
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/ResetPassword' element={<ResetPassword />} />
      <Route path='/EmailSent' element={<EmailSent />} />
    </Routes>
  )
}

export default App