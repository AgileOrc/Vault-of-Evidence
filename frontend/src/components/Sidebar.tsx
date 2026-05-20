import { Bell, Calculator, FolderKanban, LayoutDashboard, Settings, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-05.svg'

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
  const navItemBase = `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
    isCollapsed ? 'justify-center' : ''
  }`

  const navItemActive = isDark
    ? 'bg-[#002C49] text-[#F5F5F5]'
    : 'bg-[#F5F5F5] text-[#1767AA]'

  const navItemIdle = 'text-[#F5F5F5] hover:bg-[#20A6DA]'

  return (
    <aside
      className={`flex min-h-screen flex-col bg-[#1767AA] px-4 py-6 text-[#F5F5F5] transition-all ${
        isCollapsed ? 'w-[88px]' : 'w-[260px]'
      }`}
    >
      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <img src={logo} alt='Vault of Evidence logo' className='h-10 w-10' />
        {!isCollapsed && (
          <div>
            <p className='text-sm font-semibold uppercase'>Vault of Evidence</p>
            <p className='text-[10px] tracking-wider'>Where findings live.</p>
          </div>
        )}
      </div>

      <nav className='mt-10 flex flex-col gap-2'>
        <NavLink
          to='/dashboard'
          className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemIdle}`}
        >
          <LayoutDashboard className='h-5 w-5' />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink
          to='/projects'
          className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemIdle}`}
        >
          <FolderKanban className='h-5 w-5' />
          {!isCollapsed && <span>Projects</span>}
        </NavLink>
        <NavLink
          to='/cvss'
          className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemIdle}`}
        >
          <Calculator className='h-5 w-5' />
          {!isCollapsed && <span>CVSS Calculator</span>}
        </NavLink>
        <button
          type='button'
          onClick={onOpenSettings}
          className={`${navItemBase} ${navItemIdle}`}
        >
          <Settings className='h-5 w-5' />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </nav>

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
