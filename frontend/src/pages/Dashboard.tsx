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
import { useUser } from '../context/UserContext'


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
    const { user } = useUser()

    const theme = isDark
        ? {
            cardBase:
                'rounded-4xl bg-gradient-to-br from-[#F5F5F5]/15 to-[#C2C2C2]/8 border border-[#F5F5F5]/40 text-[#F5F5F5] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',

            greetings:
                'text-[#FFFFFF]',

            titles:
                'text-[#FFFFFF]',

            cardText:
                'text-[#FFFFFF]',

            description:
                'text-[#41B0EC]',

            viewAllBUtton:
                'text-[#41B0EC] hover:text-[#BDEEFF] transition-colors',

            buttonNewProject:
                'bg-[#0EB8DF] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-white hover:border hover:border-white',

            divider:
                'divide-[#27D6FF]/50',

            icon:
                'bg-[#0B2E46] text-[#41B0EC]',

            statNumber:
                'text-[#41B0EC]'
        }

        : {
            cardBase:
                'rounded-4xl bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border border-[#27D6FF]/40 border border-[#27D6FF]/10 text-[#002C49] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',

            greetings:
                'text-[#002C49]',

            titles:
                'text-[#002C49]',

            cardText:
                'text-[#0F65AD]',

            description:
                'text-[#0E65AD]',

            viewAllBUtton:
                'text-[#0E65AD] hover:text-[#3b99e6] transition-colors',

            buttonNewProject:
                'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-white hover:border hover:border-white',

            divider:
                'divide-[#1767AA]/30',

            icon:
                'bg-[#20A6DA] text-[#F5F5F5]',

            statNumber:
                'text-[#002C49]'
        }

    // const cardBase = isDark
    //     ? 'bg-gradient-to-br from-[#294B63] via-[#173B56] to-[#0B2E46] border border-[#2BA7D6]/40 text-[#F5F5F5] shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
    //     : 'bg-linear-to-br from-[#F5F5F5] to-[#27D6FF]/20 border border-[#27D6FF]/40 border border-[#BDEEFF] text-[#002C49] shadow-md'

    const badgeClass = (status: string) => {
        if (isDark) {
            if (status === 'Active')
                return 'bg-[#17E58F] text-[#005B35]'

            if (status === 'Paused')
                return 'bg-[#E6DF14] text-[#5B4100]'

            if (status === 'Upcoming')
                return 'bg-[#C017DE] text-[#40005B]'

            return 'bg-[#22BBDE] text-[#00375C]'
        }
        
        if (status === 'Active') return 'bg-[#005B35] text-[#17E58F] font-semibold'
        if (status === 'Paused') return 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        if (status === 'Upcoming') return 'bg-[#40005B] text-[#D633FF] font-semibold'
        return 'bg-[#00375C] text-[#22BBDE] font-semibold'
    }

    const severityClass = (severity: string) => {
        if (isDark) {
            if (severity === 'Critical')
                return 'bg-[#EC2828] text-[#5B0000]'

            if (severity === 'High')
                return 'bg-[#E67219] text-[#5B3000]'

            if (severity === 'Medium')
                return 'bg-[#E6DF14] text-[#5B4100]'

            return 'bg-[#17E58F] text-[#005B35]'
        }

        if (severity === 'Critical') return 'bg-[#5B0000] text-[#EC2828] font-semibold'
        if (severity === 'High') return 'bg-[#5B3100] text-[#E67219] font-semibold'
        if (severity === 'Medium') return 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        return 'bg-[#005B35] text-[#17E58F] font-semibold'
    }

    return (
        <div className='space-y-6'>
            <header className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                    <h1 className={`text-3xl font-semibold font-montserrat ${theme.greetings}`}>Hello there, {user.name}</h1>
                    <p className={`mt-1 text-lg opacity-80 font-montserrat ${theme.greetings}`}>Here is what is happening across your projects today.</p>
                </div>
                <Link
                    to='/Projects'
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-ls font-semibold font-montserrat ${theme.buttonNewProject}`}
                >
                    <Plus className='h-4 w-4' />
                    New Project
                </Link>
            </header>

            <div className='grid gap-6 md:grid-cols-4 xl:grid-cols-4'>
                <div className={`p-6 ${theme.cardBase}`}>
                    <div className='flex items-start justify-between'>
                        <div>
                            <p className={`mt-4.5 min-h-9 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Active projects</p>
                            <div className='mt-3 flex items-end gap-2'>
                                <Folder className='h-10 w-12' />
                                <span className={`text-5xl font-semibold font-montserrat ${theme.statNumber}`}>4</span>
                            </div>
                            <p className={`mt-2 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>of 12 total</p>
                        </div>
                    </div>
                </div>
                <div className={`${theme.cardBase}`}>
                    <p className={`mt-4.5 min-h-9 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Active worklists</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <ClipboardList className='h-10 w-12' />
                        <span className={`text-5xl font-semibold font-montserrat ${theme.statNumber}`}>5</span>
                    </div>
                    <p className={`mt-2 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Ongoing</p>
                </div>
                <div className={`${theme.cardBase}`}>
                    <p className={`mt-4.5 min-h-9 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Awaiting response</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <Timer className='h-11 w-12' />
                        <span className={`text-5xl font-semibold font-montserrat ${theme.statNumber}`}>7</span>
                    </div>
                    <p className={`mt-2 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Unresolved</p>
                </div>
                <div className={`${theme.cardBase}`}>
                    <p className={`min-h-14 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Unresolved critical & high</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <AlertTriangle className='h-10 w-12' />
                        <span className={`text-5xl font-semibold font-montserrat ${theme.statNumber}`}>2</span>
                    </div>
                    <p className={`mt-2 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Needs attention</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                <div className={`${theme.cardBase}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className={`text-2xl font-montserrat font-semibold ${theme.titles}`}>Project Overview</h2>
                        <Link
                            to='/Projects'
                            className={`flex items-center gap-1 text-lg font-semibold font-montserrat ${theme.viewAllBUtton}`}
                        >
                            View all
                            <ArrowUpRight className='h-4 w-4' />
                        </Link>
                    </div>
                    <div className={`mt-4 divide-y ${theme.divider}`}>
                        {projectOverview.map((project) => (
                            <div key={project.name} className='flex items-center justify-between py-3'>
                                <div>
                                    <p className={`text-ls font-montserrat font-semibold ${theme.titles}`}>{project.name}</p>
                                    <p className={`text-sm opacity-80 font-medium font-montserrat ${theme.description}`}>{project.type}</p>
                                </div>
                                <span className={`rounded-full px-6 py-1 text-xs font-montserrat font-semibold ${badgeClass(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`${theme.cardBase}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className={`text-2xl font-montserrat font-semibold ${theme.titles}`}>Recent Activity</h2>
                        <Link
                            to='/Projects'
                            className={`flex items-center gap-1 text-lg font-montserrat font-semibold ${theme.viewAllBUtton}`}
                        >
                            View all
                            <ArrowUpRight className='h-4 w-4' />
                        </Link>
                    </div>
                    <div className={`mt-4 divide-y ${theme.divider}`}>
                        {recentActivities.map((activity) => (
                            <div key={activity.text} className='flex gap-3 py-3'>
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${theme.icon}`}>
                                    <UserPlus className='h-6 w-6' />
                                </div>
                                <div>
                                    <p className={`text-md font-semibold font-montserrat ${theme.titles}`}>{activity.text}</p>
                                    <p className={`text-xs font-medium font-montserrat opacity-80 ${theme.description}`}>{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`${theme.cardBase}`}>
                <div className='flex items-center justify-between'>
                    <h2 className={`text-2xl font-montserrat font-semibold ${theme.titles}`}>Recent Findings</h2>
                    <Link
                        to='/Projects' 
                        className={`flex items-center gap-1 text-lg font-semibold  font-montserrat ${theme.viewAllBUtton}`}
                    >
                        View all
                        <ArrowUpRight className='h-4 w-4' />
                    </Link>
                </div>
                <div className={`mt-4 divide-y ${theme.divider}`}>
                    {recentFindings.map((finding) => (
                        <div key={finding.title} className='flex items-center justify-between py-3'>
                            <div>
                                <p className={`text-ls font-montserrat font-semibold ${theme.titles}`}>{finding.title}</p>
                                <p className={`text-sm opacity-80 font-medium font-montserrat ${theme.description}`}>{finding.project}</p>
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