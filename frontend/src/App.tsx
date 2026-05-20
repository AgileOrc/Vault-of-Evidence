import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import EmailSent from './pages/EmailSent'
import Projects from './pages/Projects'
import Worklist from './pages/Worklist'
import CvssCalculator from './pages/CvssCalculator'
import AppLayout from './components/AppLayout'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/email-sent' element={<EmailSent />} />

      <Route element={<AppLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/worklist' element={<Worklist />} />
        <Route path='/cvss' element={<CvssCalculator />} />
      </Route>
    </Routes>
  )
}

export default App