import { Bell, CheckCircle } from 'lucide-react'
import Modal from './Modal'

type NotificationsModalProps = {
  isOpen: boolean
  isDark: boolean
  onClose: () => void
}

const notifications = [
  {
    title: 'Bob added a critical finding on mycompany.com',
    time: '5 minutes ago'
  },
  {
    title: 'Alice updated status to Fixing on api.startup.io',
    time: '1 hour ago'
  },
  {
    title: 'Gary invited Carol to mycompany.com',
    time: '3 hours ago'
  },
  {
    title: 'Bob created worklist Login Page on mycompany.com',
    time: '5 hours ago'
  }
]

function NotificationsModal ({ isOpen, isDark, onClose }: NotificationsModalProps) {
  return (
    <Modal title='Notifications' isOpen={isOpen} isDark={isDark} onClose={onClose}>
      <div className='space-y-3'>
        {notifications.map((item) => (
          <div key={item.title} className='flex items-start gap-3 rounded-xl border border-[#27D6FF]/30 p-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#20A6DA] text-[#F5F5F5]'>
              <Bell className='h-4 w-4' />
            </div>
            <div>
              <p className='text-sm font-semibold'>{item.title}</p>
              <p className='text-xs opacity-80'>{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type='button'
        className='mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#27D6FF] px-4 py-2 text-sm font-semibold text-[#002C49]'
      >
        <CheckCircle className='h-4 w-4' />
        Mark all as read
      </button>
    </Modal>
  )
}

export default NotificationsModal
