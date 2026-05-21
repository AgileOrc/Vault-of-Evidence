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
    <div className={`min-h-screen ${pageBase} flex`}
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
          className={`absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-lg border border-[#27D6FF]/30 ${
            isDark ? 'bg-[#1767AA]' : 'bg-[#F5F5F5]'
          }`}
          aria-label='Toggle sidebar'
        >
          {isCollapsed ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
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
