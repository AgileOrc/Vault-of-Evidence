import { Bell, Calculator, FolderKanban, LayoutDashboard, Settings, User, Sun, Moon } from 'lucide-react'
import { useUser } from '../context/UserContext'
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
  const { user } = useUser()
  const navItemBase = `flex items-center gap-2 xl:gap-3 rounded-md xl:rounded-lg px-1 py-2 xl:px-3 xl:py-3 text-[0.8rem] xl:text-[1.1rem] font-semibold transition ${
    isCollapsed ? 'justify-center' : ''
  }`

  const navItemActive = 'bg-[#DCF3F8] text-[#1767AA]'
  const navItemIdle = 'text-white hover:bg-[#20A6DA]'

  return (
    <aside
      className={`font-montserrat z-40 overflow-hidden fixed md:sticky shrink-0 top-0 items-center flex flex-col min-h-screen md:h-screen px-5 py-6 md:px-4 ${isDark ? 'bg-[#1767AA]' : 'bg-gradient-to-b from-[#0E5998] to-[#0EB8DF]'} text-white transition-[width] duration-300 ${
        isCollapsed ? 'hidden md:flex xl:w-20' : 'w-48 md:w-48 xl:w-64'
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

      <div className='mt-24 md:mt-auto flex flex-col gap-2 xl:gap-4'>
        <button
          type='button'
          onClick={onOpenNotifications}
          className={`flex gap-1 xl:gap-2 text-[0.8rem] xl:text-[1.1rem] rounded-lg px-1 xl:px-3 py-3 font-semibold transition ${
            isCollapsed ? 'justify-center' : ''
          } text-white hover:bg-[#F5F5F5]/30`}
        >
          <Bell className='h-4 xl:h-6' />
          {!isCollapsed && <span>Notifications</span>}
        </button>

        <button
          type='button'
          onClick={onToggleTheme}
          className={`flex items-center gap-1 md:gap-2 xl:gap-4 text-[0.8rem] xl:text-[1.1rem] rounded-lg px-1 xl:px-3 py-2 xl:py-3 font-semibold transition ${
            isCollapsed ? 'justify-center' : 'justify-between w-full'
          } text-white hover:bg-[#20A6DA]`}
        >
          <div className='flex items-center gap-1 xl:gap-2'>
            {isDark ? <Moon className='h-4 xl:h-6' /> : <Sun className='h-4 xl:h-6' />}
            {!isCollapsed && <span>{isDark ? 'Dark mode' : 'Light mode'}</span>}
          </div>

          {!isCollapsed && (
            <div className={`relative flex h-4.5 w-7 xl:h-6.5 xl:w-10 items-center rounded-full border-2 border-[#DCF3F8] ${
              isDark ? 'bg-transparent' : 'bg-[#1767AA]'
            }`}>
              <span className={`absolute h-3.5 w-3.5 xl:h-5 xl:w-5 rounded-full bg-[#DCF3F8] transition-all ${
                isDark ? 'translate-x-[0.6rem] xl:translate-x-[0.95rem]' : 'translate-x-[0.1rem] md:translate-x-[0.05rem] xl:translate-x-0.5'
              }`} />
            </div>
          )}
        </button>

        <NavLink
          to='/profile'
          className={`flex items-center px-1 py-2 xl:px-1.5 gap-2 rounded-lg hover:bg-[#20A6DA] transition ${
              isCollapsed ? 'justify-center' : ''
          }`}
      >
          <div className='flex items-center justify-center p-1 xl:p-1.5 rounded-full bg-[#20A6DA]'>
              <User className='h-3.5 w-3.5 xl:h-6 xl:w-6' />
          </div>
          {!isCollapsed && (
              <div>
                  <p className='text-xs xl:text-[1.15rem] font-semibold'>{user.name}</p>
                  <p className='text-[0.5rem] xl:text-xs opacity-80'>{user.email}</p>
              </div>
          )}
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
