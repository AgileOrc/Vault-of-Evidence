import { useState } from 'react'
import { Bell, CheckCircle, Check, X } from 'lucide-react'
import Modal from './Modal'

type NotificationsModalProps = {
  isOpen: boolean
  isDark: boolean
  onClose: () => void
}

type Notification = {
  id: string
  type: 'info' | 'invitation'
  title: string
  time: string
  read: boolean
  // invitation only
  invitedBy?: string
  projectName?: string
  role?: string
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'invitation',
    title: 'Gary invited you to join mycompany.com',
    time: '3 hours ago',
    read: false,
    invitedBy: 'Gary',
    projectName: 'mycompany.com',
    role: 'Pentester',
  },
  {
    id: '2',
    type: 'invitation',
    title: 'Alice invited you to join api.startup.io',
    time: '1 day ago',
    read: false,
    invitedBy: 'Alice',
    projectName: 'api.startup.io',
    role: 'Developer',
  },
  {
    id: '3',
    type: 'info',
    title: 'Bob added a critical finding on mycompany.com',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'Alice updated status to Fixing on api.startup.io',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Bob created worklist Login Page on mycompany.com',
    time: '5 hours ago',
    read: true,
  },
]

function NotificationsModal ({ isOpen, isDark, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS)

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const handleAccept = (id: string) => {
    // TODO: call api.post(`/invitations/${id}/accept`)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleDeny = (id: string) => {
    // TODO: call api.post(`/invitations/${id}/deny`)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const rowBase = `flex gap-3 rounded-xl border p-3 transition ${
    isDark ? 'border-[#27D6FF]/20' : 'border-[#27D6FF]/30'
  }`
  const unreadDot = isDark ? 'bg-[#27D6FF]' : 'bg-[#1767AA]'

  return (
    <Modal title='Notifications' isOpen={isOpen} isDark={isDark} onClose={onClose}>
      <div className='space-y-3 max-h-[60vh] overflow-y-auto pr-1'>
        {notifications.length === 0 && (
          <p className='text-sm text-center opacity-50 font-montserrat py-4'>No notifications.</p>
        )}

        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`${rowBase} ${!notif.read ? (isDark ? 'bg-[#27D6FF]/5' : 'bg-[#27D6FF]/10') : ''}`}
            onClick={() => markRead(notif.id)}
          >
            {/* Icon */}
            <div className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-full ${
              notif.type === 'invitation'
                ? isDark ? 'bg-[#1767AA] text-[#27D6FF]' : 'bg-[#27D6FF]/20 text-[#1767AA]'
                : 'bg-[#20A6DA] text-[#F5F5F5]'
            }`}>
              <Bell className='h-4 w-4' />
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between gap-2'>
                <p className='text-sm font-semibold font-montserrat'>{notif.title}</p>
                {!notif.read && <span className={`shrink-0 mt-1.5 w-2 h-2 rounded-full ${unreadDot}`} />}
              </div>

              {notif.type === 'invitation' && notif.role && (
                <p className='text-xs opacity-60 font-montserrat mt-0.5'>
                  Role: <span className='font-semibold'>{notif.role}</span>
                </p>
              )}

              <p className='text-xs opacity-60 font-montserrat mt-0.5'>{notif.time}</p>

              {/* Accept / Deny buttons */}
              {notif.type === 'invitation' && (
                <div className='flex gap-2 mt-2'>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAccept(notif.id) }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold font-montserrat transition ${
                      isDark
                        ? 'bg-[#1767AA] text-white hover:bg-[#41B0EC]'
                        : 'bg-[#1767AA] text-white hover:bg-[#41B0EC]'
                    }`}
                  >
                    <Check size={12} /> Accept
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeny(notif.id) }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold font-montserrat border transition ${
                      isDark
                        ? 'border-[#EC2828]/60 text-[#EC2828] hover:bg-[#EC2828] hover:text-white'
                        : 'border-[#EC2828]/60 text-[#EC2828] hover:bg-[#EC2828] hover:text-white'
                    }`}
                  >
                    <X size={12} /> Deny
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type='button'
        onClick={markAllRead}
        className='mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#27D6FF] px-4 py-2 text-sm font-semibold text-[#002C49]'
      >
        <CheckCircle className='h-4 w-4' />
        Mark all as read
      </button>
    </Modal>
  )
}

export default NotificationsModal
