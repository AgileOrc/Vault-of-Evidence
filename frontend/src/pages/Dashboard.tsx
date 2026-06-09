import { useEffect, useState } from 'react'
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
import { NewProjectModal } from '../components/PopUp'
import api from '../api/axios'

type ProjectData = {
    id: string
    name: string
    description: string
    status: string
}

type FindingData = {
    id: string
    title: string
    severity: string
    project?: string
    worklist?: string
    status?: string
}

type DashboardSummary = {
    totalProjects: number
    activeProjects: number
    criticalHighCount: number
    recentProjects: ProjectData[]
    recentFindings: FindingData[]
}

function StatCard({ title, value, subtitle, icon: Icon, theme, iconClass }: {
    title: string | React.ReactNode
    value: number | string
    subtitle: string
    icon: React.ElementType
    theme: any
    iconClass?: string
}) {
    return (
        <div className={`px-10 lg:px-14 xl:px-10 h-52 md:h-56 xl:h-68 flex flex-col gap-2 xl:gap-3 justify-center ${theme.cardBase}`}>
            <p className={`text-lg md:text-xl xl:text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>{title}</p>
            <div className='flex items-center gap-2 xl:gap-3'>
                <Icon className={`h-10 w-10 md:h-12 md:w-12 ${iconClass}`} />
                <span className={`text-5xl xl:text-6xl font-semibold font-montserrat ${theme.statNumber}`}>{value}</span>
            </div>
            <p className={`text-lg md:text-xl xl:text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>{subtitle}</p>
        </div>
    )
}

function Dashboard () {
    const { isDark } = useOutletContext<LayoutContext>()
    const { user } = useUser()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<DashboardSummary | null>(null)

    const [showNewProject, setShowNewProject] = useState(false)

    useEffect(() => {
        api.get('/projects/dashboard/summary')
            .then((res) => {
                setData(res.data)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])

    const theme = isDark
        ? {
            cardBase: 'rounded-3xl xl:rounded-4xl bg-gradient-to-br from-[#F5F5F5]/15 to-[#C2C2C2]/8 border border-[#F5F5F5]/40 text-[#F5F5F5] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',
            greetings: 'text-[#FFFFFF]',
            titles: 'text-[#FFFFFF]',
            cardText: 'text-[#FFFFFF]',
            description: 'text-[#41B0EC]',
            viewAllBUtton: 'text-[#41B0EC] hover:text-[#BDEEFF] transition-colors',
            buttonNewProject: 'bg-linear-to-br from-[#0EB8DF] to-[#138FC5] text-white hover:bg-white hover:bg-none hover:text-[#138FC5] hover:border-2 hover:border-[#0EB8DF]',
            divider: 'divide-[#27D6FF]/50',
            icon: 'bg-[#0B2E46] text-[#41B0EC]',
            statNumber: 'text-[#41B0EC]',
            statIcon: 'text-[#F5F5F5]'
        }
        : {
            cardBase: 'rounded-3xl xl:rounded-4xl bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border border-[#27D6FF]/40 text-[#002C49] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',
            greetings: 'text-[#002C49]',
            titles: 'text-[#002C49]',
            cardText: 'text-[#0F65AD]',
            description: 'text-[#0E65AD]',
            viewAllBUtton: 'text-[#0E65AD] hover:text-[#3b99e6] transition-colors',
            buttonNewProject: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-white hover:border hover:border-white',
            divider: 'divide-[#1767AA]/30',
            icon: 'bg-[#20A6DA] text-[#F5F5F5]',
            statNumber: 'text-[#002C49]',
            statIcon: 'text-[#0E65AD]'
        }

    const badgeClass = (status: string) => {
        const cleanStatus = (status || 'planning').toLowerCase()
        if (isDark) {
            if (cleanStatus === 'active') return 'bg-[#17E58F] text-[#005B35]'
            if (cleanStatus === 'paused') return 'bg-[#E6DF14] text-[#5B4100]'
            if (cleanStatus === 'upcoming') return 'bg-[#C017DE] text-[#40005B]'
            return 'bg-[#22BBDE] text-[#00375C]'
        }
        
        if (cleanStatus === 'active') return 'bg-[#005B35] text-[#17E58F] font-semibold'
        if (cleanStatus === 'paused') return 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        if (cleanStatus === 'upcoming') return 'bg-[#40005B] text-[#D633FF] font-semibold'
        return 'bg-[#00375C] text-[#22BBDE] font-semibold'
    }

    const severityClass = (severity: string) => {
        const cleanSeverity = (severity || 'low').toLowerCase()
        if (cleanSeverity === 'critical') return isDark ? 'bg-[#EC2828] text-[#5B0000]' : 'bg-[#5B0000] text-[#EC2828] font-semibold'
        if (cleanSeverity === 'high') return isDark ? 'bg-[#E67219] text-[#5B3000]' : 'bg-[#5B3100] text-[#E67219] font-semibold'
        if (cleanSeverity === 'medium') return isDark ? 'bg-[#E6DF14] text-[#5B4100]' : 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        return isDark ? 'bg-[#17E58F] text-[#005B35]' : 'bg-[#005B35] text-[#17E58F] font-semibold'
    }
    
    if (loading) {
        return <div className="text-center p-10 font-montserrat">Loading secure workspace...</div>
    }

    return (
        <div className='space-y-8 md:space-y-12 xl:space-y-6'>
            <header className='flex flex-wrap gap-6 items-start justify-between'>
                <div className='flex flex-col xl:gap-1'>
                    <h1 className={`text-2xl xl:text-3xl font-semibold font-montserrat ${theme.greetings}`}>Hello there, {user.name}</h1>
                    <p className={`text-sm md:text-md xl:text-lg opacity-80 font-montserrat ${theme.greetings}`}>Here is what is happening across your projects today.</p>
                </div> 
                <button
                    onClick={() => setShowNewProject(true)}
                    className={`flex items-center gap-1 xl:gap-2 rounded-md md:rounded-lg px-3 xl:px-4 py-1.5 xl:py-2 text-sm md:text-md xl:text-lg font-semibold font-montserrat ${theme.buttonNewProject}`}>
                    <Plus className='h-4 w-4' /> New Project
                </button>
            </header>
            
            {/* Statistik Atas: Data Asli dari Backend */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                <StatCard title='Active projects' value={data?.activeProjects || 0} subtitle={`of ${data?.totalProjects || 0} total`} icon={Folder} iconClass={theme.statIcon} theme={theme} />
                <StatCard title='Active worklists' value={0} subtitle='Ongoing' icon={ClipboardList} iconClass={theme.statIcon} theme={theme} />
                <StatCard title='Waiting response' value={0} subtitle='Unresolved' icon={Timer} iconClass={theme.statIcon} theme={theme} />
                <StatCard title={<>Unresolved <br /> critical & high</>} value={data?.criticalHighCount || 0} subtitle='Needs attention' icon={AlertTriangle} iconClass={theme.statIcon} theme={theme} />
            </div>

            {/* Project Overview Card & Recent Activity*/}
            <div className='flex flex-col xl:flex-row gap-5'>
                {/* Project Overview */}
                <div className={`w-full px-8 py-8 lg:px-10 ${theme.cardBase}`}>
                    <div className='flex flex-col gap-2 md:flex-row items-start md:items-center justify-between'>
                        <h2 className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold md:py-2 xl:py-3 ${theme.titles}`}>Project Overview</h2>
                        <Link to='/Projects' className={`flex items-center gap-0.5 md:gap-1 text-md md:text-lg xl:text-xl font-semibold font-montserrat ${theme.viewAllBUtton}`}>
                            View all <ArrowUpRight className='h-4 w-4 md:h-5 md:w-5 xl:h-6 xl:w-6' />
                        </Link>
                    </div>
                    <div className={`divide-y ${theme.divider}`}>
                        {data?.recentProjects && data.recentProjects.length > 0 ? (
                            data.recentProjects.map((project) => (
                                <div key={project.id} className='flex flex-col md:flex-row items-start md:items-center justify-between py-3'>
                                    <div className='flex flex-col gap-1 md:gap-0 py-1 md:py-0'>
                                        <p className={`text-md md:text-ls font-montserrat font-semibold ${theme.titles}`}>{project.name}</p>
                                        <p className={`text-xs md:text-sm opacity-80 font-medium font-montserrat ${theme.description}`}>{project.description || 'No description available'}</p>
                                    </div>
                                    <span className={`rounded-full px-3 md:px-5 xl:px-6 py-1 text-xs font-montserrat font-semibold ${badgeClass(project.status)}`}>
                                        {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Planning'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="rounded-full text-center py-4 text-[0.65rem] md:text-xs opacity-60 font-montserrat font-semibold mt-4">You haven't joined any projects yet.</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity (Statik Sementara) */}
                <div className={`px-8 py-8 lg:px-8 min-w-1/3 ${theme.cardBase}`}>
                    <div className='flex flex-col gap-2 md:flex-row items-start md:items-center justify-between'>
                        <h2 className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold md:py-2 xl:py-3 ${theme.titles}`}>Recent Activity</h2>
                    </div>
                    <div className={`divide-y ${theme.divider}`}>
                        <div className='flex gap-3 py-3'>
                            <div className={`hidden md:flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full ${theme.icon}`}>
                                <UserPlus className='h-4 w-4 md:h-6 md:w-6' />
                            </div>
                            <div className='flex flex-col gap-0.5'>
                                <p className={`text-sm md:text-md font-semibold font-montserrat ${theme.titles}`}>System ready and fully encrypted.</p>
                                <p className={`text-xs font-medium font-montserrat opacity-80 ${theme.description}`}>Just now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Findings dari Backend */}
            <div className={`px-8 py-8 lg:px-10 ${theme.cardBase}`}>
                <div className='flex flex-col gap-2 md:flex-row items-start md:items-center justify-between'>
                    <h2 className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold md:py-2 xl:py-3 ${theme.titles}`}>Recent Findings</h2>
                    <Link to='/Projects' className={`flex items-center gap-0.5 md:gap-1 text-md md:text-lg xl:text-xl font-semibold font-montserrat ${theme.viewAllBUtton}`}>
                        View all <ArrowUpRight className='h-4 w-4 md:h-5 md:w-5 xl:h-6 xl:w-6' />
                    </Link>
                </div>
                <div className={`divide-y ${theme.divider}`}>
                    {data?.recentFindings && data.recentFindings.length > 0 ? (
                        data.recentFindings.map((finding) => (
                            <div key={finding.id} className='flex flex-col md:flex-row items-start md:items-center justify-between py-3'>
                                <div className='flex flex-col gap-1 md:gap-0 py-1 md:py-0'>
                                    <p className={`text-md md:text-ls font-montserrat font-semibold ${theme.titles}`}>{finding.title}</p>
                                    <p className={`text-xs md:text-sm opacity-80 font-medium font-montserrat ${theme.description}`}>
                                        {finding.project || 'General'} - {finding.worklist || finding.status || 'Open'}
                                    </p>
                                </div>
                                <span className={`rounded-full px-2 py-0.5 md:px-4 md:py-1 text-xs font-montserrat font-semibold capitalize ${severityClass(finding.severity)}`}>
                                    {finding.severity || 'Low'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="rounded-full text-center py-4 text-[0.65rem] md:text-xs opacity-60 font-montserrat font-semibold mt-4">No vulnerabilities reported yet.</p>
                    )}
                </div>
            </div>
            
            <NewProjectModal
                isOpen={showNewProject}
                isDark={isDark}
                onClose={() => setShowNewProject(false)}
                onSubmit={(data) => console.log('new project', data)}
            />

        </div>
    )
}

export default Dashboard