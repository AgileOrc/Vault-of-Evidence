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
            cardBase: 'bg-gradient-to-br from-[#294B63] via-[#173B56] to-[#0B2E46] border border-[#2BA7D6]/40 text-[#F5F5F5] shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
            greetings: 'text-[#FFFFFF]',
            titles: 'text-[#FFFFFF]',
            cardText: 'text-[#FFFFFF]',
            description: 'text-[#41B0EC]',
            viewAllBUtton: 'text-[#41B0EC] hover:text-[#BDEEFF] transition-colors',
            buttonNewProject: 'bg-[#0EB8DF] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-white',
            divider: 'divide-[#27D6FF]/50',
            icon: 'bg-[#0B2E46] text-[#41B0EC]',
            statNumber: 'text-[#41B0EC]'
        }
        : {
            cardBase: 'bg-linear-to-br from-[#F5F5F5] to-[#27D6FF]/20 border border-[#27D6FF]/40 text-[#002C49] shadow-md',
            greetings: 'text-[#002C49]',
            titles: 'text-[#002C49]',
            cardText: 'text-[#0F65AD]',
            description: 'text-[#0E65AD]',
            viewAllBUtton: 'text-[#0E65AD] hover:text-[#3b99e6] transition-colors',
            buttonNewProject: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-white',
            divider: 'divide-[#1767AA]/30',
            icon: 'bg-[#20A6DA] text-[#F5F5F5]',
            statNumber: 'text-[#002C49]'
        }

    const badgeClass = (status: string) => {
        const cleanStatus = status.toLowerCase()
        if (cleanStatus === 'active') return isDark ? 'bg-[#17E58F] text-[#005B35]' : 'bg-[#005B35] text-[#17E58F] font-semibold'
        if (cleanStatus === 'paused') return isDark ? 'bg-[#E6DF14] text-[#5B4100]' : 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        return isDark ? 'bg-[#22BBDE] text-[#00375C]' : 'bg-[#00375C] text-[#22BBDE] font-semibold'
    }

    const severityClass = (severity: string) => {
        if (severity === 'Critical') return isDark ? 'bg-[#EC2828] text-[#5B0000]' : 'bg-[#5B0000] text-[#EC2828] font-semibold'
        if (severity === 'High') return isDark ? 'bg-[#E67219] text-[#5B3000]' : 'bg-[#5B3100] text-[#E67219] font-semibold'
        if (severity === 'Medium') return isDark ? 'bg-[#E6DF14] text-[#5B4100]' : 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        return isDark ? 'bg-[#17E58F] text-[#005B35]' : 'bg-[#005B35] text-[#17E58F] font-semibold'
    }

    if (loading) {
        return <div className="text-center p-10 font-montserrat">Loading secure workspace summary...</div>
    }

    return (
        <div className='space-y-6'>
            <header className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                    <h1 className={`text-3xl font-semibold font-montserrat ${theme.greetings}`}>Workspace Dashboard</h1>
                    <p className={`mt-1 text-lg opacity-80 font-montserrat ${theme.greetings}`}>Sistem terenkripsi pemantauan evidence dan vulnerability report.</p>
                </div>
                <Link to='/Projects' className={`flex items-center gap-2 rounded-lg px-4 py-2 text-ls font-semibold font-montserrat ${theme.buttonNewProject}`}>
                    <Plus className='h-4 w-4' /> New Project
                </Link>
            </header>

            {/* Statistik Atas */}
            <div className='grid gap-6 md:grid-cols-4 xl:grid-cols-4'>
                <div className={`rounded-2xl p-6 ${theme.cardBase}`}>
                    <p className={`mt-4.5 min-h-9 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Active Projects</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <Folder className='h-10 w-12' />
                        <span className={`text-5xl font-semibold font-montserrat ${theme.statNumber}`}>{data?.activeProjects || 0}</span>
                    </div>
                    <p className={`mt-2 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>of {data?.totalProjects || 0} total</p>
                </div>
                <div className={`rounded-2xl p-6 ${theme.cardBase}`}>
                    <p className={`mt-4.5 min-h-9 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Active Tasks</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <ClipboardList className='h-10 w-12' />
                        <span className={`text-5xl font-semibold font-montserrat ${theme.statNumber}`}>5</span>
                    </div>
                    <p className={`mt-2 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Ongoing (Dummy)</p>
                </div>
                <div className={`rounded-2xl p-6 ${theme.cardBase}`}>
                    <p className={`mt-4.5 min-h-9 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Awaiting Response</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <Timer className='h-11 w-12' />
                        <span className={`text-5xl font-semibold font-montserrat ${theme.statNumber}`}>7</span>
                    </div>
                    <p className={`mt-2 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Unresolved (Dummy)</p>
                </div>
                <div className={`rounded-2xl p-6 ${theme.cardBase}`}>
                    <p className={`min-h-14 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Critical & High Bug</p>
                    <div className='mt-3 flex items-end gap-2'>
                        <AlertTriangle className='h-10 w-12 text-red-500' />
                        <span className={`text-5xl font-semibold font-montserrat text-red-500`}>{data?.criticalHighCount || 0}</span>
                    </div>
                    <p className={`mt-2 text-xl opacity-80 font-montserrat font-medium ${theme.cardText}`}>Needs Attention</p>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                {/* Project Overview */}
                <div className={`rounded-2xl p-6 ${theme.cardBase}`}>
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