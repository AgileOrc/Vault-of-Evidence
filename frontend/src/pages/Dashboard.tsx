import {
    AlertTriangle,
    ArrowUpRight,
    ClipboardList,
    Folder,
    Plus,
    Timer,
    UserPlus
} from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'

const projectOverview = [
    { name: 'mycompany.com', type: 'Web Application', status: 'Active' },
    { name: 'api.startup.io', type: 'API Security', status: 'Active' },
    { name: 'staging.app.io', type: 'Web Application', status: 'Paused' },
    { name: 'newclient.com', type: 'Web Application', status: 'Upcoming' },
    { name: 'corp.enterprise.com', type: 'Internal Network', status: 'Completed' }
]

const recentActivities = [
    { text: 'Bob added a Critical finding on mycompany.com', time: '5 minutes ago' },
    { text: 'Alice updated status to Fixing on api.startup.io', time: '1 hour ago' },
    { text: 'Gary invited Carol to mycompany.com', time: '3 hours ago' },
    { text: 'Bob created worklist Login Page on mycompany.com', time: '5 hours ago' },
    { text: 'Alice inviting You to newproject.com', time: 'Yesterday' }
]

const recentFindings = [
    { title: 'SQL Injection on /api/v1/auth/login', project: 'mycompany.com - Login Page', severity: 'Critical' },
    { title: 'Reflected XSS on /search?q=', project: 'api.startup.io - Search Feature', severity: 'Medium' },
    { title: 'Broken Authentication on /api/v1/auth/forgot-password', project: 'mycompany.com - Forgot Password', severity: 'High' },
    { title: 'Sensitive Data Exposure on /api/v1/users/profile', project: 'staging.app.io - User Profile', severity: 'Medium' },
    { title: 'Missing Secure Flag on /api/v1/users/profile', project: 'corp.enterprise.com - Login Page', severity: 'Low' }
]

function Dashboard () {
    const { isDark } = useOutletContext<LayoutContext>()

    const cardBase = isDark
        ? 'bg-gradient-to-br from-[#294B63] via-[#173B56] to-[#0B2E46] border border-[#2BA7D6]/40 text-[#F5F5F5] shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
        : 'bg-linear-to-br from-[#F5F5F5] to-[#27D6FF]/20 border border-[#27D6FF]/40 border border-[#BDEEFF] text-[#002C49] shadow-md'

    const badgeClass = (status: string) => {
        if (status === 'Active') return 'bg-[#005B35] text-[#17E58F] font-semibold shadow-sm'
        if (status === 'Paused') return 'bg-[#5B4100] text-[#E6DF14] font-semibold shadow-sm'
        if (status === 'Upcoming') return 'bg-[#40005B] text-[#D633FF] font-semibold shadow-sm'
        return 'bg-[#00375C] text-[#22BBDE] font-semibold shadow-sm'
    }

    const severityClass = (severity: string) => {
        if (severity === 'Critical') return 'bg-[#5B0000] text-[#EC2828] font-semibold shadow-sm'
        if (severity === 'High') return 'bg-[#5B3100] text-[#E67219] font-semibold shadow-sm'
        if (severity === 'Medium') return 'bg-[#5B4100] text-[#E6DF14] font-semibold shadow-sm'
        return 'bg-[#005B35] text-[#17E58F] font-semibold shadow-sm'
    }

    return (
        <div className='space-y-6'>
            <header className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-semibold font-montserrat text-[#002C49]'>Hello there, User</h1>
                    <p className='mt-1 text-lg opacity-80 font-montserrat text-[#002C49]'>Here is what is happening across your projects today.</p>
                </div>
                <Link
                    to='/Projects'
                    className='flex items-center gap-2 rounded-lg bg-[#1767AA] px-4 py-2 text-ls font-semibold font-montserrat text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-white hover:border hover:border-white'
                >
                    <Plus className='h-4 w-4' />
                    New Project
                </Link>
            </header>

            <div className='grid gap-6 md:grid-cols-4 xl:grid-cols-4'>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <div className='flex items-start justify-between'>
                        <div>
                            <p className='mt-4.5 min-h-9 text-xl opacity-80 text-[#0F65AD] font-montserrat font-medium'>Active projects</p>
                            <div className='mt-3 flex items-end gap-2'>
                                <Folder className='h-10 w-12' />
                                <span className='text-5xl font-semibold text-[#002C49] font-montserrat'>4</span>
                            </div>
                            <p className='mt-2 text-xl opacity-80 text-[#0F65AD] font-montserrat font-medium'>of 12 total</p>
                        </div>
                    </div>
                </div>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <p className='mt-4.5 min-h-9 text-xl opacity-80 text-[#0F65AD] font-montserrat font-medium'>Active worklists</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <ClipboardList className='h-10 w-12' />
                        <span className='text-5xl font-semibold text-[#002C49] font-montserrat'>5</span>
                    </div>
                    <p className='mt-2 text-xl opacity-80 text-[#0F65AD] font-montserrat font-medium'>Ongoing</p>
                </div>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <p className='mt-4.5 min-h-9 text-xl opacity-80 text-[#0F65AD] font-montserrat font-medium'>Awaiting response</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <Timer className='h-11 w-12' />
                        <span className='text-5xl font-semibold text-[#002C49] font-montserrat'>7</span>
                    </div>
                    <p className='mt-2 text-xl opacity-80 text-[#0F65AD] font-montserrat font-medium'>Unresolved</p>
                </div>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <p className='min-h-14 text-xl opacity-80 text-[#0F65AD] font-montserrat font-medium'>Unresolved critical & high</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <AlertTriangle className='h-10 w-12' />
                        <span className='text-5xl font-semibold text-[#002C49] font-montserrat'>2</span>
                    </div>
                    <p className='mt-2 text-xl opacity-80 text-[#0F65AD] font-montserrat font-medium'>Needs attention</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-2xl font-montserrat font-semibold'>Project Overview</h2>
                        <Link
                            to='/Projects'
                            className='flex items-center gap-1 text-lg font-semibold font-montserrat text-[#0E65AD] hover:text-[#3b99e6] transition-colors'
                        >
                            View all
                            <ArrowUpRight className='h-4 w-4' />
                        </Link>
                    </div>
                    <div className='mt-4 divide-y divide-[#1767AA]/30'>
                        {projectOverview.map((project) => (
                            <div key={project.name} className='flex items-center justify-between py-3'>
                                <div>
                                    <p className='text-ls font-montserrat font-semibold'>{project.name}</p>
                                    <p className='text-sm opacity-80 text-[#0E65AD] font-medium font-montserrat'>{project.type}</p>
                                </div>
                                <span className={`rounded-full px-6 py-1 text-xs font-montserrat font-semibold ${badgeClass(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-2xl font-montserrat font-semibold'>Recent Activity</h2>
                        <Link
                            to='/Projects'
                            className='flex items-center gap-1 text-lg font-montserrat font-semibold text-[#0E65AD] hover:text-[#3b99e6] transition-colors'
                        >
                            View all
                            <ArrowUpRight className='h-4 w-4' />
                        </Link>
                    </div>
                    <div className='mt-4 divide-y divide-[#1767AA]/30'>
                        {recentActivities.map((activity) => (
                            <div key={activity.text} className='flex gap-3 py-3'>
                                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#20A6DA] text-[#F5F5F5]'>
                                    <UserPlus className='h-6 w-6' />
                                </div>
                                <div>
                                    <p className='text-md font-semibold font-montserrat'>{activity.text}</p>
                                    <p className='text-xs text-[#0E65AD] font-medium font-montserrat opacity-80'>{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl p-6 ${cardBase}`}>
                <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-montserrat font-semibold'>Recent Findings</h2>
                    <Link
                        to='/Projects' 
                        className='flex items-center gap-1 text-lg font-semibold  font-montserrat text-[#0E65AD] hover:text-[#3b99e6] transition-colors'
                    >
                        View all
                        <ArrowUpRight className='h-4 w-4' />
                    </Link>
                </div>
                <div className='mt-4 divide-y divide-[#1767AA]/30'>
                    {recentFindings.map((finding) => (
                        <div key={finding.title} className='flex items-center justify-between py-3'>
                            <div>
                                <p className='text-ls font-montserrat font-semibold'>{finding.title}</p>
                                <p className='text-sm opacity-80 text-[#0E65AD] font-medium font-montserrat'>{finding.project}</p>
                            </div>
                            <span className={`rounded-full px-6 py-1 text-sm font-montserrat font-semibold ${severityClass(finding.severity)}`}>
                                {finding.severity}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;