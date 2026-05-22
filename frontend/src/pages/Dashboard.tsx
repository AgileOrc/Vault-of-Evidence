import {
    AlertTriangle,
    ArrowUpRight,
    ClipboardList,
    Folder,
    Plus,
    Timer,
    UserPlus
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
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
        ? 'bg-gradient-to-br from-[#1767AA] to-[#002C49] border border-[#27D6FF]/20 text-[#F5F5F5]'
        : 'bg-[#F5F5F5] border border-[#27D6FF]/40 text-[#002C49] shadow-sm'

    const badgeClass = (status: string) => {
        if (status === 'Active') return 'bg-[#27D6FF] text-[#002C49]'
        if (status === 'Paused') return 'bg-[#20A6DA] text-[#002C49]'
        if (status === 'Upcoming') return 'bg-[#1767AA] text-[#F5F5F5]'
        return 'bg-[#002C49] text-[#F5F5F5]'
    }

    const severityClass = (severity: string) => {
        if (severity === 'Critical') return 'bg-[#002C49] text-[#F5F5F5]'
        if (severity === 'High') return 'bg-[#1767AA] text-[#F5F5F5]'
        if (severity === 'Medium') return 'bg-[#20A6DA] text-[#002C49]'
        return 'bg-[#27D6FF] text-[#002C49]'
    }

    return (
        <div className='space-y-6'>
            <header className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-semibold'>Hello there, User</h1>
                    <p className='mt-1 text-sm opacity-80'>Here is what is happening across your projects today.</p>
                </div>
                <button
                    type='button'
                    className='flex items-center gap-2 rounded-lg bg-[#27D6FF] px-4 py-2 text-sm font-semibold text-[#002C49]'
                >
                    <Plus className='h-4 w-4' />
                    New Project
                </button>
            </header>

            <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <div className='flex items-start justify-between'>
                        <div>
                            <p className='text-sm opacity-80'>Active projects</p>
                            <div className='mt-3 flex items-end gap-2'>
                                <Folder className='h-6 w-6' />
                                <span className='text-3xl font-semibold'>4</span>
                            </div>
                            <p className='mt-2 text-xs opacity-80'>of 12 total</p>
                        </div>
                    </div>
                </div>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <p className='text-sm opacity-80'>Active worklists</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <ClipboardList className='h-6 w-6' />
                        <span className='text-3xl font-semibold'>5</span>
                    </div>
                    <p className='mt-2 text-xs opacity-80'>Ongoing</p>
                </div>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <p className='text-sm opacity-80'>Awaiting response</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <Timer className='h-6 w-6' />
                        <span className='text-3xl font-semibold'>7</span>
                    </div>
                    <p className='mt-2 text-xs opacity-80'>Unresolved</p>
                </div>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <p className='text-sm opacity-80'>Unresolved critical & high</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <AlertTriangle className='h-6 w-6' />
                        <span className='text-3xl font-semibold'>2</span>
                    </div>
                    <p className='mt-2 text-xs opacity-80'>Needs attention</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold'>Project Overview</h2>
                        <button type='button' className='flex items-center gap-1 text-sm font-semibold'>
                            View all
                            <ArrowUpRight className='h-4 w-4' />
                        </button>
                    </div>
                    <div className='mt-4 divide-y divide-[#27D6FF]/20'>
                        {projectOverview.map((project) => (
                            <div key={project.name} className='flex items-center justify-between py-3'>
                                <div>
                                    <p className='text-sm font-semibold'>{project.name}</p>
                                    <p className='text-xs opacity-80'>{project.type}</p>
                                </div>
                                <span className={`rounded-full px-4 py-1 text-xs font-semibold ${badgeClass(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`rounded-2xl p-6 ${cardBase}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold'>Recent Activity</h2>
                        <button type='button' className='flex items-center gap-1 text-sm font-semibold'>
                            View all
                            <ArrowUpRight className='h-4 w-4' />
                        </button>
                    </div>
                    <div className='mt-4 space-y-4'>
                        {recentActivities.map((activity) => (
                            <div key={activity.text} className='flex gap-3'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#20A6DA] text-[#F5F5F5]'>
                                    <UserPlus className='h-4 w-4' />
                                </div>
                                <div>
                                    <p className='text-sm font-semibold'>{activity.text}</p>
                                    <p className='text-xs opacity-80'>{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl p-6 ${cardBase}`}>
                <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>Recent Findings</h2>
                    <button type='button' className='flex items-center gap-1 text-sm font-semibold'>
                        View all
                        <ArrowUpRight className='h-4 w-4' />
                    </button>
                </div>
                <div className='mt-4 divide-y divide-[#27D6FF]/20'>
                    {recentFindings.map((finding) => (
                        <div key={finding.title} className='flex items-center justify-between py-3'>
                            <div>
                                <p className='text-sm font-semibold'>{finding.title}</p>
                                <p className='text-xs opacity-80'>{finding.project}</p>
                            </div>
                            <span className={`rounded-full px-4 py-1 text-xs font-semibold ${severityClass(finding.severity)}`}>
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