import { Bell, Calculator, FolderKanban, LayoutDashboard, Settings, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-01.svg'

type SidebarProps = {
  isDark: boolean
  isCollapsed: boolean
  onToggleTheme: () => void
  onOpenSettings: () => void
  onOpenNotifications: () => void
}

function Sidebar ({
  isDark,
  isCollapsed,
  onToggleTheme,
  onOpenSettings,
  onOpenNotifications
}: SidebarProps) {
  const navItemBase = `flex items-center gap-2 xl:gap-3 rounded-md xl:rounded-lg px-1 py-2 xl:px-3 xl:py-3 text-[0.8rem] xl:text-[1.1rem] font-semibold transition ${
    isCollapsed ? 'justify-center' : ''
  }`

  const navItemActive = 'bg-[#DCF3F8] text-[#1767AA]'

  const navItemIdle = 'text-[#F5F5F5] hover:bg-[#20A6DA]'

  return (
    <aside
      className={`font-montserrat sticky top-0 md:flex flex-col h-screen ${isDark ? 'bg-[#1767AA]' : 'bg-gradient-to-b from-[#0E5998] to-[#0EB8DF]'} px-3 py-6 md:px-4 text-white transition-all ${
        isCollapsed ? 'hidden xl:w-20' : 'w-45 xl:w-64'
      }`}
    >
      <div className='flex flex-col gap-y-10'>
        <div className={`flex items-center gap-1 xl:gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <img src={logo} alt='Vault of Evidence Logo' className='h-7 w-7 xl:h-10 xl:w-10' />
          {!isCollapsed && (
            <div>
              <p className='text-[0.6rem] xl:text-[0.95rem] font-semibold uppercase'>Vault of Evidence</p>
              <p className='text-[0.5rem] xl:text-[0.65rem] tracking-wider uppercase'>Where findings live.</p>
            </div>
          )}
        </div>

        <nav className='flex flex-col gap-0.75 xl:gap-4'>
          <NavLink
            to='/dashboard'
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemIdle} flex flex-row gap-x-1`}
          >
            <LayoutDashboard className='h-4 xl:h-6' />
            {!isCollapsed && <span className=''>Dashboard</span>}
          </NavLink>
          <NavLink
            to='/projects'
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemIdle} flex flex-row gap-x-1`}
          >
            <FolderKanban className='h-4 xl:h-6' />
            {!isCollapsed && <span>Projects</span>}
          </NavLink>
          <NavLink
            to='/cvss'
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemIdle} flex flex-row gap-x-1`}
          >
            <Calculator className='h-4 xl:h-6' />
            {!isCollapsed && <span>CVSS Calculator</span>}
          </NavLink>
          <button
            type='button'
            onClick={onOpenSettings}
            className={`${navItemBase} ${navItemIdle} flex flex-row gap-x-1`}
          >
            <Settings className='h-4 xl:h-6' />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </nav>
      </div>

{/* INI KE BAWAH BLM KELAR YGY */}
      <div className='mt-auto flex flex-col gap-4'>
        <button
          type='button'
          onClick={onOpenNotifications}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            isCollapsed ? 'justify-center' : ''
          } text-[#F5F5F5] hover:bg-[#20A6DA]`}
        >
          <Bell className='h-5 w-5' />
          {!isCollapsed && <span>Notifications</span>}
        </button>

        <button
          type='button'
          onClick={onToggleTheme}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            isCollapsed ? 'justify-center' : ''
          } text-[#F5F5F5] hover:bg-[#20A6DA]`}
        >
          <div
            className={`relative flex h-5 w-9 items-center rounded-full border border-[#F5F5F5]/50 ${
              isDark ? 'bg-[#002C49]' : 'bg-[#F5F5F5]'
            }`}
          >
            <span
              className={`absolute h-4 w-4 rounded-full bg-[#27D6FF] transition ${
                isDark ? 'translate-x-4' : 'translate-x-1'
              }`}
            />
          </div>
          {!isCollapsed && <span>{isDark ? 'Dark mode' : 'Light mode'}</span>}
        </button>

        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#20A6DA]'>
            <User className='h-5 w-5' />
          </div>
          {!isCollapsed && (
            <div>
              <p className='text-sm font-semibold'>Your Name</p>
              <p className='text-xs opacity-80'>youremail@mail.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
