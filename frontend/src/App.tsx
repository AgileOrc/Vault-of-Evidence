import { Routes, Route } from 'react-router-dom'

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
import Findings from './pages/Findings'
import Profile from './pages/UserProfile'
import CVSSCalculator from './pages/CVSSCalculator'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Projects' element={<Projects />} />
        <Route path="/Projects/New" element={<NewProject />} />
        <Route path="/projects/:projectId/worklists" element={<Worklist />} />
        <Route path='/projects/:projectId/worklists/:worklistId/findings' element={<Findings />} />
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