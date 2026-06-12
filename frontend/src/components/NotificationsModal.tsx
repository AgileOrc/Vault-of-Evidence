import { useEffect, useState } from 'react'
import { Bell, CheckCircle, Check, X } from 'lucide-react'
import Modal from './Modal'
import api from '../api/axios'

type NotificationsModalProps = {
  isOpen: boolean
  isDark: boolean
  onClose: () => void
  onUnreadChange?: (count: number) => void
}

type Notification = {
  id: string
  type: 'info' | 'invitation'
  title: string
  message: string
  read: boolean
  role?: string
  status?: string
  created_at: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function NotificationsModal ({ isOpen, isDark, onClose, onUnreadChange }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await api.get('/notifications')
      const data: Notification[] = res.data.data ?? []
      setNotifications(data)
      onUnreadChange?.(data.filter(n => !n.read).length)
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) fetchNotifications()
  }, [isOpen])

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      onUnreadChange?.(0)
    } catch { /* ignore */ }
  }

  const handleAccept = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/accept`)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, status: 'accepted', read: true } : n)
      )
      onUnreadChange?.(notifications.filter(n => !n.read && n.id !== id).length)
    } catch { /* ignore */ }
  }

  const handleDeny = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/deny`)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, status: 'denied', read: true } : n)
      )
      onUnreadChange?.(notifications.filter(n => !n.read && n.id !== id).length)
    } catch { /* ignore */ }
  }

  const markRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id)
    if (!notif || notif.read) return
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      onUnreadChange?.(notifications.filter(n => !n.read && n.id !== id).length)
    } catch { /* ignore */ }
  }

  const rowBase = `flex gap-3 rounded-xl border p-3 transition ${
    isDark ? 'border-[#27D6FF]/20' : 'border-[#27D6FF]/30'
  }`
  const unreadDot = isDark ? 'bg-[#27D6FF]' : 'bg-[#1767AA]'

  return (
    <Modal title='Notifications' isOpen={isOpen} isDark={isDark} onClose={onClose}>
      <div className='space-y-3 max-h-[60vh] overflow-y-auto pr-1'>
        {loading && (
          <p className='text-sm text-center opacity-50 font-montserrat py-4'>Loading...</p>
        )}

        {!loading && notifications.length === 0 && (
          <p className='text-sm text-center opacity-50 font-montserrat py-4'>No notifications.</p>
        )}

        {notifications.map((notif) => {
          const isPending = notif.type === 'invitation' && notif.status === 'pending'
          const isDone = notif.status === 'accepted' || notif.status === 'denied'

          return (
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

                <p className='text-xs opacity-60 font-montserrat mt-0.5'>{timeAgo(notif.created_at)}</p>

                {/* Accept / Deny buttons */}
                {isPending && (
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

                {isDone && (
                  <p className={`text-xs font-semibold mt-1 font-montserrat ${
                    notif.status === 'accepted' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {notif.status === 'accepted' ? 'Accepted' : 'Denied'}
                  </p>
                )}
              </div>
            </div>
          )
        })}
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
