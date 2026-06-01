import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import SettingsModal from './SettingsModal'
import NotificationsModal from './NotificationsModal'

export type LayoutContext = {
  isDark: boolean
}

function AppLayout () {
  const [isDark, setIsDark] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const pageBase = isDark
    ? 'bg-[#002C49] text-[#F5F5F5]'
    : 'bg-[#F5F5F5] text-[#002C49]'

  return (
    <div className={`min-h-screen ${pageBase} flex max-w-screen`}
    >
      <Sidebar
        isDark={isDark}
        isCollapsed={isCollapsed}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenNotifications={() => setShowNotifications(true)}
      />

      <div className='relative flex-1'>
        <button
          type='button'
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={`absolute left-3 xl:left-6 top-6 flex h-7 w-7 xl:h-10 xl:w-10 items-center justify-center rounded-md xl:rounded-lg bg-[#1767AA] text-white hover:text-[#1767AA] hover:bg-white hover:outline-2 hover:outline-[#1767AA]`}
          aria-label='Toggle sidebar'
        >
          {isCollapsed ? <ChevronRight className='h-4 lg:h-5 xl:h-7' /> : <ChevronLeft className='h-4 lg:h-5 xl:h-7' />}
        </button>

        <main className='px-12 pb-12 pt-20'>
          <Outlet context={{ isDark }} />
        </main>
      </div>

      <SettingsModal isOpen={showSettings} isDark={isDark} onClose={() => setShowSettings(false)} />
      <NotificationsModal isOpen={showNotifications} isDark={isDark} onClose={() => setShowNotifications(false)} />
    </div>
  )
}

export default AppLayout
