import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type ModalProps = {
  title: string
  isOpen: boolean
  isDark: boolean
  onClose: () => void
  children: ReactNode
}

function Modal ({ title, isOpen, isDark, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#002C49]/60 p-6'>
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-xl ${
          isDark
            ? 'bg-[#002C49] border-[#27D6FF]/30 text-[#F5F5F5]'
            : 'bg-[#F5F5F5] border-[#27D6FF]/30 text-[#002C49]'
        }`}
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>{title}</h3>
          <button
            type='button'
            onClick={onClose}
            className='rounded-full p-2 transition hover:bg-[#002C49]/20'
            aria-label='Close modal'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
        <div className='mt-4 space-y-4'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal