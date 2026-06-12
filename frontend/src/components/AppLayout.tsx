import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import SettingsModal from './SettingsModal'
import NotificationsModal from './NotificationsModal'

export type LayoutContext = {
  isDark: boolean
  isCollapsed: boolean
}

function AppLayout () {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('isDark') === 'true'
  })
  
  useEffect(() => {
    localStorage.setItem('isDark', String(isDark))
  }, [isDark])
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('isCollapsed') === 'true'
  })
  
  useEffect(() => {
    localStorage.setItem('isCollapsed', String(isCollapsed))
  }, [isCollapsed])
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const pageBase = isDark
    ? 'bg-[#002C49] text-[#F5F5F5]'
    : 'bg-[#F5F5F5] text-[#002C49]'

  return (
    <div className={`min-h-screen ${pageBase} md:flex md:max-w-screen`}
    >
      <Sidebar
        isDark={isDark}
        isCollapsed={isCollapsed}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenNotifications={() => setShowNotifications(true)}
      />

      <div className='relative flex-1 overflow-x-hidden'>
        <button
          type='button'
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={`fixed top-8 md:top-6 flex h-8 w-8 xl:h-10 xl:w-10 items-center justify-center rounded-md xl:rounded-lg bg-[#1767AA] text-white hover:text-[#1767AA] hover:bg-white hover:outline-2 hover:outline-[#1767AA] transition-all ${
              isCollapsed ? 'left-6 md:left-20 xl:left-24' : 'left-54 md:left-52 xl:left-68'
          }`}
          aria-label='Toggle sidebar'
        >
          {isCollapsed ? <ChevronRight className='h-5 xl:h-7 ' /> : <ChevronLeft className='h-5 xl:h-7' />}
        </button>

        <main className='px-12 md:px-16 xl:px-18 pb-12 pt-20 md:pt-18 xl:pt-20'>
          <Outlet context={{ isDark, isCollapsed }} />
        </main>
      </div>

      <SettingsModal isOpen={showSettings} isDark={isDark} onClose={() => setShowSettings(false)} />
      <NotificationsModal isOpen={showNotifications} isDark={isDark} onClose={() => setShowNotifications(false)} />
    </div>
  )
}

export default AppLayout
