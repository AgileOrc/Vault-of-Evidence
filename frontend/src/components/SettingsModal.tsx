import { Mail, ShieldCheck, User } from 'lucide-react'
import Modal from './Modal'

type SettingsModalProps = {
  isOpen: boolean
  isDark: boolean
  onClose: () => void
}

function SettingsModal ({ isOpen, isDark, onClose }: SettingsModalProps) {
  return (
    <Modal title='Settings' isOpen={isOpen} isDark={isDark} onClose={onClose}>
      <div className='flex items-center gap-3'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#20A6DA] text-[#F5F5F5]'>
          <User className='h-5 w-5' />
        </div>
        <div>
          <p className='text-sm font-semibold'>Your Name</p>
          <p className='text-xs opacity-80'>youremail@mail.com</p>
        </div>
      </div>

      <div className='space-y-3 rounded-xl border border-[#27D6FF]/30 p-4'>
        <div className='flex items-center gap-3'>
          <ShieldCheck className='h-5 w-5 text-[#20A6DA]' />
          <div>
            <p className='text-sm font-semibold'>Security</p>
            <p className='text-xs opacity-80'>Two-factor authentication is enabled.</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Mail className='h-5 w-5 text-[#20A6DA]' />
          <div>
            <p className='text-sm font-semibold'>Email Preferences</p>
            <p className='text-xs opacity-80'>Weekly report notifications are active.</p>
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-3'>
        <button
          type='button'
          onClick={onClose}
          className='rounded-lg border border-[#27D6FF]/40 px-4 py-2 text-sm font-semibold'
        >
          Close
        </button>
        <button
          type='button'
          className='rounded-lg bg-[#27D6FF] px-4 py-2 text-sm font-semibold text-[#002C49]'
        >
          Save Changes
        </button>
      </div>
    </Modal>
  )
}

export default SettingsModal
