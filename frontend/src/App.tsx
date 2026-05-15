import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/Signup'
import ResetPassword from './pages/ResetPassword'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/Dashboard' element={<Dashboard />} />
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/ResetPassword' element={<ResetPassword />} />
    </Routes>
  )
}

export default App