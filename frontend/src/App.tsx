import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import CreateFinding from './pages/CreateFinding'
import Findings from './pages/Findings'
import Worklist from './pages/Worklist'
import Scopes from './pages/Scopes'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/ResetPassword' element={<ResetPassword />} />
      
      {/* Protected Routes Wrapper */}
      <Route element={<Layout />}>
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Findings' element={<Findings />} />
        <Route path='/Findings/New' element={<CreateFinding />} />
        <Route path='/Worklist' element={<Worklist />} />
        <Route path='/Scopes' element={<Scopes />} />
        <Route path='/Reports' element={<Reports />} />
        <Route path='/Settings' element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App