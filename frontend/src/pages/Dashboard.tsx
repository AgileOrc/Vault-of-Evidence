import React, { useEffect, useState } from 'react'
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
    status: string
}

type DashboardSummary = {
    totalProjects: number
    activeProjects: number
    criticalHighCount: number
    recentProjects: ProjectData[]
    recentFindings: FindingData[]
}

function Dashboard () {
    const { isDark } = useOutletContext<LayoutContext>()
    const { user } = useUser()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<DashboardSummary | null>(null)

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
        if (severity === 'Critical') return isDark ? 'bg-[#EC2828] text-[#5B0000]' : 'bg-[#5B0000] text-[#EC2828] font-semibold'
        if (severity === 'High') return isDark ? 'bg-[#E67219] text-[#5B3000]' : 'bg-[#5B3100] text-[#E67219] font-semibold'
        if (severity === 'Medium') return isDark ? 'bg-[#E6DF14] text-[#5B4100]' : 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        return isDark ? 'bg-[#17E58F] text-[#005B35]' : 'bg-[#005B35] text-[#17E58F] font-semibold'
    }
    
    return (
        <div className='space-y-6'>
            <header className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                    <h1 className={`text-3xl font-semibold font-montserrat ${theme.greetings}`}>Hello there, {user.name}</h1>
                    <p className={`mt-1 text-lg opacity-80 font-montserrat ${theme.greetings}`}>Here is what is happening across your projects today.</p>
                </div>
                <Link to='/Projects' className={`flex items-center gap-2 rounded-lg px-4 py-2 text-ls font-semibold font-montserrat ${theme.buttonNewProject}`}>
                    <Plus className='h-4 w-4' /> New Project
                </Link>
            </header>

            {/* Statistik Atas */}
            <div className='grid gap-6 md:grid-cols-4 xl:grid-cols-4'>
                <div className={`py-12 px-10 h-68 flex flex-col gap-3 justify-center ${theme.cardBase}`}>
                    <p className={`text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>Active projects</p>
                    <div className='flex items-center gap-3'>
                        <Folder className='h-12 w-12 text-[#0E65AD]' />
                            <span className={`text-6xl font-semibold font-montserrat ${theme.statNumber}`}>4</span>
                    </div>
                    <p className={`text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>of {data?.totalProjects || 0} total</p>
                </div>
                <div className={`py-12 px-10 h-68 flex flex-col justify-center gap-3 ${theme.cardBase}`}>
                    <p className={`text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>Active worklists</p>
                    <div className='flex items-center gap-3'>
                        <ClipboardList className='h-12 w-12 text-[#0E65AD]' />
                        <span className={`text-6xl font-semibold font-montserrat ${theme.statNumber}`}>5</span>
                    </div>
                    <p className={`text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>Ongoing</p>
                </div>
                <div className={`py-12 px-10 h-68 flex flex-col justify-center gap-3 ${theme.cardBase}`}>
                    <p className={`text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>Waiting response</p>
                    <div className='flex items-center gap-3'>
                        <Timer className='h-12 w-12 text-[#0E65AD]' />
                        <span className={`text-6xl font-semibold font-montserrat ${theme.statNumber}`}>7</span>
                    </div>
                    <p className={`text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>Unresolved</p>
                </div>
                <div className={`py-12 px-10 h-68 flex flex-col justify-center gap-3 ${theme.cardBase}`}>
                    <p className={`text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>Unresolved critical & high</p>
                    <div className='flex items-center gap-3'>
                        <AlertTriangle className='h-12 w-12 text-[#0E65AD]' />
                        <span className={`text-6xl font-semibold font-montserrat ${theme.statNumber}`}>2</span>
                    </div>
                    <p className={`text-[1.4rem] font-montserrat font-medium ${theme.cardText}`}>Needs attention</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                <div className={`${theme.cardBase}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className={`text-2xl font-montserrat font-semibold ${theme.titles}`}>Project Overview</h2>
                        <Link to='/Projects' className={`flex items-center gap-1 text-lg font-semibold font-montserrat ${theme.viewAllBUtton}`}>
                            View all <ArrowUpRight className='h-4 w-4' />
                        </Link>
                    </div>
                    <div className={`mt-4 divide-y ${theme.divider}`}>
                        {data?.recentProjects && data.recentProjects.length > 0 ? (
                            data.recentProjects.map((project) => (
                                <div key={project.id} className='flex items-center justify-between py-3'>
                                    <div>
                                        <p className={`text-ls font-montserrat font-semibold ${theme.titles}`}>{project.name}</p>
                                        <p className={`text-sm opacity-80 font-medium font-montserrat ${theme.description}`}>{project.description || 'No description available'}</p>
                                    </div>
                                    <span className={`rounded-full px-6 py-1 text-xs font-montserrat font-semibold ${badgeClass(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm py-4 text-center opacity-60 font-montserrat">You haven't joined any projects yet.</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity (Tetap dummy karena tidak ada tabel log aktivitas di DB saat ini) */}
                <div className={`rounded-2xl p-6 ${theme.cardBase}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className={`text-2xl font-montserrat font-semibold ${theme.titles}`}>Recent Activity</h2>
                        <Link to='/Projects' className={`flex items-center gap-1 text-lg font-montserrat font-semibold ${theme.viewAllBUtton}`}>
                            View all <ArrowUpRight className='h-4 w-4' />
                        </Link>
                    </div>
                    <div className={`mt-4 divide-y ${theme.divider}`}>
                        <div className='flex gap-3 py-3'>
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${theme.icon}`}>
                                <UserPlus className='h-6 w-6' />
                            </div>
                            <div>
                                <p className={`text-md font-semibold font-montserrat ${theme.titles}`}>System ready and fully encrypted.</p>
                                <p className={`text-xs font-medium font-montserrat opacity-80 ${theme.description}`}>Just now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Findings dari Backend */}
            <div className={`rounded-2xl p-6 ${theme.cardBase}`}>
                <div className='flex items-center justify-between'>
                    <h2 className={`text-2xl font-montserrat font-semibold ${theme.titles}`}>Recent Findings Across Projects</h2>
                    <Link to='/Projects' className={`flex items-center gap-1 text-lg font-semibold font-montserrat ${theme.viewAllBUtton}`}>
                        View all <ArrowUpRight className='h-4 w-4' />
                    </Link>
                </div>
                <div className={`mt-4 divide-y ${theme.divider}`}>
                    {data?.recentFindings && data.recentFindings.length > 0 ? (
                        data.recentFindings.map((finding) => (
                            <div key={finding.id} className='flex items-center justify-between py-3'>
                                <div>
                                    <p className={`text-ls font-montserrat font-semibold ${theme.titles}`}>{finding.title}</p>
                                    <p className={`text-sm opacity-80 font-medium font-montserrat ${theme.description}`}>Status: {finding.status}</p>
                                </div>
                                <span className={`rounded-full px-6 py-1 text-sm font-montserrat font-semibold ${severityClass(finding.severity)}`}>
                                    {finding.severity}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm py-4 text-center opacity-60 font-montserrat">No vulnerabilities reported yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard