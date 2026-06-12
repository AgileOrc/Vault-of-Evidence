import { useState } from 'react'
import { LogOut, User } from 'lucide-react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'
import EditProfile from '../components/EditProfile'
import { useUser } from '../context/UserContext'

type UserProfileData = {
    fullName: string
    nickname: string
    email: string
    address: string
    contactNumber: string
}

function Profile() {
    const { isDark } = useOutletContext<LayoutContext>()
    const { user, logout } = useUser()
    const navigate = useNavigate()
    const [showEditModal, setShowEditModal] = useState(false)

    const [profile, setProfile] = useState<UserProfileData>({
        fullName: user.username,
        nickname: user.nickname || '',
        email: user.email,
        address: user.address || '',
        contactNumber: user.contactNumber || '',
    })

    const handleUpdateProfile = (updatedData: UserProfileData) => {
        setProfile(updatedData)
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const theme = isDark
        ? {
            cardBase: 'rounded-2xl md:rounded-3xl xl:rounded-4xl bg-gradient-to-br from-[#F5F5F5]/15 to-[#C2C2C2]/8 border border-[#F5F5F5]/40 text-[#F5F5F5] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',
            titles: 'text-[#FFFFFF]',
            subTitles: 'text-[#41B0EC]',
            buttonEdit: 'bg-[#0EB8DF] text-[#FFFFFF] hover:bg-[#41B0EC]',
            buttonLogout: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white',
            inputLabel: 'text-[#FFFFFF] opacity-90',
            inputBox: 'bg-[#0B2E46]/50 border border-[#2BA7D6]/30 text-[#FFFFFF]'
          }
        : {
            cardBase: 'rounded-2xl md:rounded-3xl xl:rounded-4xl bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border border-[#27D6FF]/40 text-[#002C49] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',
            titles: 'text-[#002C49]',
            subTitles: 'text-[#0F65AD]',
            buttonEdit: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC]',
            buttonLogout: 'bg-red-50 text-red-500 border border-red-300 hover:bg-red-500 hover:text-white',
            inputLabel: 'text-[#002C49] font-semibold',
            inputBox: 'bg-[#EDF7FC] border border-[#27D6FF]/40 text-[#002C49]'
          }

    return (
        <div className='space-y-6 md:space-y-12 xl:space-y-6 max-w-7xl mx-auto px-2 sm:px-4 md:px-0 font-montserrat'>

            <header className='flex flex-col sm:flex-row gap-4 sm:items-center justify-between'>
                <div className='space-y-0.5 md:space-y-1'>
                    <h1 className={`text-2xl xl:text-3xl font-semibold ${theme.titles}`}>Profile</h1>
                    <p className={`text-xs md:text-md xl:text-lg opacity-80 ${theme.titles}`}>Manage your profile account details.</p>
                </div>
                <div className='flex gap-3'>
                    <button
                        onClick={() => setShowEditModal(true)}
                        className={`w-full sm:w-auto text-center justify-center flex items-center gap-1 xl:gap-2 rounded-md md:rounded-lg px-4 py-2 text-sm md:text-md xl:text-lg font-semibold transition-colors shadow-md cursor-pointer ${theme.buttonEdit}`}
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className={`w-full sm:w-auto text-center justify-center flex items-center gap-1 xl:gap-2 rounded-md md:rounded-lg px-4 py-2 text-sm md:text-md xl:text-lg font-semibold transition-colors cursor-pointer ${theme.buttonLogout}`}
                    >
                        <LogOut className='h-4 w-4' /> Logout
                    </button>
                </div>
            </header>

            <div className={`p-5 sm:p-8 md:p-12 ${theme.cardBase}`}>

                <div className='flex items-center gap-4 sm:gap-6 mb-8 md:mb-10'>
                    <div className='flex h-16 w-16 sm:h-20 sm:w-20 xl:h-24 xl:w-24 shrink-0 items-center justify-center rounded-full bg-[#B0D4EC] text-[#002C49]'>
                        <User className='h-8 w-8 sm:h-12 sm:w-12 xl:h-14 xl:w-14' />
                    </div>
                    <div className='min-w-0 flex-1'>
                        <h2 className={`text-lg sm:text-2xl font-bold truncate ${theme.titles}`}>{user.username}</h2>
                        <p className={`text-sm sm:text-lg font-medium truncate ${theme.subTitles}`}>{user.email}</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                    <div className='space-y-1.5 md:space-y-2'>
                        <label className={`text-sm sm:text-md block ${theme.inputLabel}`}>Username</label>
                        <input type='text' readOnly value={user.username} className={`w-full rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-md font-medium outline-none ${theme.inputBox}`} />
                    </div>

                    <div className='space-y-1.5 md:space-y-2'>
                        <label className={`text-sm sm:text-md block ${theme.inputLabel}`}>Email</label>
                        <input type='text' readOnly value={user.email} className={`w-full rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-md font-medium outline-none ${theme.inputBox}`} />
                    </div>

                    <div className='space-y-1.5 md:space-y-2'>
                        <label className={`text-sm sm:text-md block ${theme.inputLabel}`}>Nickname</label>
                        <input type='text' readOnly value={profile.nickname} className={`w-full rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-md font-medium outline-none ${theme.inputBox}`} />
                    </div>

                    <div className='space-y-1.5 md:space-y-2'>
                        <label className={`text-sm sm:text-md block ${theme.inputLabel}`}>Contact Number</label>
                        <input type='text' readOnly value={profile.contactNumber} className={`w-full rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-md font-medium outline-none ${theme.inputBox}`} />
                    </div>

                    <div className='space-y-1.5 md:space-y-2 md:col-span-2'>
                        <label className={`text-sm sm:text-md block ${theme.inputLabel}`}>Address</label>
                        <input type='text' readOnly value={profile.address} className={`w-full rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-md font-medium outline-none ${theme.inputBox}`} />
                    </div>

                    <div className='space-y-1.5 md:space-y-2'>
                        <label className={`text-sm sm:text-md block ${theme.inputLabel}`}>Password</label>
                        <input type='password' readOnly value='••••••••••••' className={`w-full rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-md font-medium outline-none ${theme.inputBox}`} />
                    </div>
                </div>
            </div>

            <EditProfile
                isOpen={showEditModal}
                isDark={isDark}
                onClose={() => setShowEditModal(false)}
                currentData={profile}
                onSaveSuccess={handleUpdateProfile}
            />
        </div>
    )
}

export default Profile
