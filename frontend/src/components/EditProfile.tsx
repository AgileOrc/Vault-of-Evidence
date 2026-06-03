import React, { useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

type EditProfileProps = {
  isOpen: boolean
  isDark: boolean
  onClose: () => void
  currentData: UserProfileData
  onSaveSuccess: (updatedData: UserProfileData) => void
}

type UserProfileData = {
  fullName: string
  nickname: string
  email: string
  address: string
  contactNumber: string
}

function EditProfile({ isOpen, isDark, onClose, currentData, onSaveSuccess }: EditProfileProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [profile, setProfile] = useState<UserProfileData>({ ...currentData })
  const [password, setPassword] = useState('******')
  const [confirmPassword, setConfirmPassword] = useState('******')

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    
    setTimeout(() => {
      setIsSaved(false)
      onSaveSuccess(profile)
      onClose()
    }, 1500)
  }

  const theme = isDark
    ? {
        modalBg: 'bg-gradient-to-br from-[#294B63] via-[#173B56] to-[#0B2E46] border border-[#2BA7D6]/40 text-[#F5F5F5] shadow-2xl',
        titles: 'text-[#FFFFFF]',
        inputLabel: 'text-[#FFFFFF] opacity-90',
        inputBox: 'bg-[#0B2E46]/50 border border-[#2BA7D6]/30 text-[#FFFFFF] focus:border-[#2BA7D6]',
        buttonSave: 'bg-[#0EB8DF] text-[#FFFFFF] hover:bg-[#41B0EC]'
      }
    : {
        modalBg: 'bg-white border border-[#27D6FF]/40 text-[#002C49] shadow-2xl',
        titles: 'text-[#002C49]',
        inputLabel: 'text-[#002C49] font-semibold',
        inputBox: 'bg-[#EDF7FC] border border-[#27D6FF]/40 text-[#002C49] focus:border-[#1767AA]',
        buttonSave: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC]'
      }

  return (
    // Backdrop overlay menggunakan items-center di desktop, tapi di HP diberi sedikit padding atas-bawah agar tidak mepet layar luar
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 font-montserrat animate-fade-in'>
      
      {/* Box Modal Utama */}
      <div className={`relative w-full max-w-3xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 transition-all overflow-y-auto max-h-[calc(100vh-2rem)] ${theme.modalBg}`}>
        
        {/* Tombol Close Pojok Kanan Atas */}
        <button onClick={onClose} className='absolute top-5 right-5 opacity-60 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-500/10 cursor-pointer'>
          <X className='h-5 w-5 sm:h-6 sm:w-6' />
        </button>

        {isSaved ? (
          <div className='flex flex-col items-center justify-center py-10 md:py-12 text-center'>
            <div className='flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100 text-green-500 mb-4 animate-bounce'>
              <CheckCircle2 className='h-8 w-8 sm:h-10 sm:w-10' />
            </div>
            <h3 className='text-xl sm:text-2xl font-bold mb-1.5'>Changes Saved!</h3>
            <p className='text-xs sm:text-sm opacity-80'>Your profile account details have been successfully updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className='space-y-5 sm:space-y-6'>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${theme.titles}`}>Edit Profile</h2>
              <p className='text-xs sm:text-sm opacity-80 mt-0.5'>Update your profile account details.</p>
            </div>

            {/* Grid Form Input Responsif */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5'>
              <div className='space-y-1.5'>
                <label className={`text-xs sm:text-sm block ${theme.inputLabel}`}>Full Name</label>
                <input type='text' name='fullName' value={profile.fullName} onChange={handleChange} className={`w-full rounded-xl px-4 py-2 sm:py-2.5 text-sm outline-none transition-all ${theme.inputBox}`} />
              </div>
              <div className='space-y-1.5'>
                <label className={`text-xs sm:text-sm block ${theme.inputLabel}`}>Nickname</label>
                <input type='text' name='nickname' value={profile.nickname} onChange={handleChange} className={`w-full rounded-xl px-4 py-2 sm:py-2.5 text-sm outline-none transition-all ${theme.inputBox}`} />
              </div>
              
              {/* Di halaman edit, kita biarkan Address bertumpuk 1 kolom di HP, dan 2 kolom di PC agar seimbang */}
              <div className='space-y-1.5 md:col-span-2'>
                <label className={`text-xs sm:text-sm block ${theme.inputLabel}`}>Address</label>
                <input type='text' name='address' value={profile.address} onChange={handleChange} className={`w-full rounded-xl px-4 py-2 sm:py-2.5 text-sm outline-none transition-all ${theme.inputBox}`} />
              </div>
              
              <div className='space-y-1.5'>
                <label className={`text-xs sm:text-sm block ${theme.inputLabel}`}>Contact Number</label>
                <input type='text' name='contactNumber' value={profile.contactNumber} onChange={handleChange} className={`w-full rounded-xl px-4 py-2 sm:py-2.5 text-sm outline-none transition-all ${theme.inputBox}`} />
              </div>
              <div className='space-y-1.5'>
                <label className={`text-xs sm:text-sm block ${theme.inputLabel}`}>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full rounded-xl px-4 py-2 sm:py-2.5 text-sm outline-none transition-all ${theme.inputBox}`} />
              </div>
              <div className='space-y-1.5 md:col-span-2'>
                <label className={`text-xs sm:text-sm block ${theme.inputLabel}`}>Confirm Password</label>
                <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full rounded-xl px-4 py-2 sm:py-2.5 text-sm outline-none transition-all ${theme.inputBox}`} />
              </div>
            </div>

            {/* Tombol Aksi Bawah: Di HP bertumpuk vertikal dengan flex-col-reverse agar tombol Save tetap berada di atas Cancel saat posisi mobile */}
            <div className='flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-[#27D6FF]/20'>
              <button type='button' onClick={onClose} className='w-full sm:w-auto text-center justify-center px-5 py-2 text-sm font-semibold rounded-lg border border-gray-400/40 hover:bg-gray-500/10 transition-colors cursor-pointer'>
                Cancel
              </button>
              <button type='submit' className={`w-full sm:w-auto text-center justify-center px-6 py-2 text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer ${theme.buttonSave}`}>
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditProfile