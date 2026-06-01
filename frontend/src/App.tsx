import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import EmailSent from './pages/EmailSent'
import AppLayout from './components/AppLayout'
import CreateNewPassword from './pages/CreateNewPassword'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path='/Dashboard' element={<Dashboard />} />
      </Route>
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/ResetPassword' element={<ResetPassword />} />
      <Route path='/EmailSent' element={<EmailSent />} />
      <Route path='/CreateNewPassword' element={<CreateNewPassword />} />
    </Routes>
  )
}

export default App