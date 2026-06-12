import { useEffect, useState } from 'react'
import { Bell, CheckCircle, X } from 'lucide-react'
import Modal from './Modal'
import api from '../api/axios'

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
  message?: string
  // invitation only
  invitedBy?: string
  projectName?: string
  role?: string
}

type NotificationResponse = {
  id: string
  type: 'info' | 'invitation'
  title: string
  message?: string
  read: boolean
  created_at: string
  invited_by?: string
  project_name?: string
  role?: string
}

function NotificationsModal ({ isOpen, isDark, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const roleLabel = (role?: string) => {
    if (role === 'pm') return 'Project Manager'
    if (role === 'dev') return 'Developer'
    if (role === 'pentester') return 'Pentester'
    return role
  }

  const formatTime = (value: string) => {
    if (!value) return ''
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  const mapNotification = (notif: NotificationResponse): Notification => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    read: notif.read,
    time: formatTime(notif.created_at),
    invitedBy: notif.invited_by,
    projectName: notif.project_name,
    role: roleLabel(notif.role),
  })

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const res = await api.get('/notifications')
      setNotifications((res.data.data || []).map(mapNotification))
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) loadNotifications()
  }, [isOpen])

  const markAllRead = async () => {
    await api.put('/notifications/read-all')
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const dismiss = async (id: string) => {
    await api.delete(`/notifications/${id}`)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markRead = async (id: string) => {
    await api.put(`/notifications/${id}/read`)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const rowBase = `flex gap-3 rounded-xl border p-3 transition ${
    isDark ? 'border-[#27D6FF]/20' : 'border-[#27D6FF]/30'
  }`
  const unreadDot = isDark ? 'bg-[#27D6FF]' : 'bg-[#1767AA]'

  return (
    <Modal title='Notifications' isOpen={isOpen} isDark={isDark} onClose={onClose}>
      <div className='space-y-3 max-h-[60vh] overflow-y-auto pr-1'>
        {loading && (
          <p className='text-sm text-center opacity-50 font-montserrat py-4'>Loading notifications...</p>
        )}

        {!loading && notifications.length === 0 && (
          <p className='text-sm text-center opacity-50 font-montserrat py-4'>No notifications.</p>
        )}

        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`${rowBase} ${!notif.read ? (isDark ? 'bg-[#27D6FF]/5' : 'bg-[#27D6FF]/10') : ''}`}
            onClick={() => { if (!notif.read) markRead(notif.id) }}
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

              {notif.message && (
                <p className='text-xs opacity-70 font-montserrat mt-1'>{notif.message}</p>
              )}

              <p className='text-xs opacity-60 font-montserrat mt-0.5'>{notif.time}</p>

              {/* Invite notification is informational because membership is already active. */}
              {notif.type === 'invitation' && (
                <div className='flex gap-2 mt-2'>
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(notif.id) }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold font-montserrat border transition ${
                      isDark
                        ? 'border-[#EC2828]/60 text-[#EC2828] hover:bg-[#EC2828] hover:text-white'
                        : 'border-[#EC2828]/60 text-[#EC2828] hover:bg-[#EC2828] hover:text-white'
                      }`}
                  >
                    <X size={12} /> Dismiss
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
        disabled={notifications.length === 0}
        className='mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#27D6FF] px-4 py-2 text-sm font-semibold text-[#002C49]'
      >
        <CheckCircle className='h-4 w-4' />
        Mark all as read
      </button>
    </Modal>
  )
}

export default NotificationsModal
