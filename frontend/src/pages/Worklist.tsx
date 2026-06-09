import { useEffect, useState } from 'react'
import { Users, FileText, Bug, Search, Trash2, FilePlusCorner, Pencil } from 'lucide-react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import CustomSelect from '../components/CustomSelect'
import type { LayoutContext } from '../components/AppLayout'
import api from '../api/axios'
import { getPageTheme } from '../utils/theme'

type ProjectData = {
    id: string
    name: string
    type: string
    members: number
    worklists: number
    findings: number
    status: string
    description: string
}

type WorklistData = {
    id: string
    name: string
    code: string
    findings: number
    status: string
}

function Worklist () {
    const { isDark } = useOutletContext<LayoutContext>()
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [project, setProject] = useState<ProjectData | null>(null)
    const [worklists, setWorklists] = useState<WorklistData[]>([])
    const { projectId } = useParams()

    useEffect(() => {
        api.get(`/projects/${projectId}`)
            .then((res) => {
                setProject(res.data.project)
                setWorklists(res.data.worklists)
                setLoading(false)
            })
            .catch(() => {
                setProject({
                    id: projectId || '1',
                    name: 'mycompany.com (Dummy)',
                    description: 'Web application penetration testing for mycompany.com e-commerce platform. Covers authentication, authorization, session management, and business logic testing.',
                    type: 'Web Application',
                    members: 5,
                    worklists: 5,
                    findings: 10,
                    status: 'active'
                })
                setWorklists([
                    { id: '1', name: 'Login Page',      code: 'WSTG-ATHN, WSTG-SESS', findings: 3, status: 'in progress' },
                    { id: '2', name: 'User Profile',    code: 'WSTG-ATHZ',             findings: 1, status: 'in progress' },
                    { id: '3', name: 'Search Feature',  code: 'WSTG-INPV',             findings: 2, status: 'in progress' },
                    { id: '4', name: 'Register Page',   code: 'WSTG-IDNT',             findings: 4, status: 'completed'   },
                    { id: '5', name: 'Forgot Password', code: 'WSTG-ATHN',             findings: 0, status: 'not started' },
                ])
                setLoading(false)
            })
    }, [projectId])

    const filteredWorklists = worklists.filter((worklist) => {
        const matchSearch = worklist.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = statusFilter === 'all' || worklist.status.toLowerCase() === statusFilter.toLowerCase()
        return matchSearch && matchStatus
    })

    const theme = getPageTheme(isDark)

    const badgeClass = (status: string) => {
        if (isDark) {
            if (status === 'in progress') return 'bg-[#27D6FF] text-[#136AB2]'
            if (status === 'completed')   return 'bg-[#136AB2] text-[#F5F5F5]'
            return 'text-[#27D6FF] border border-[#27D6FF]'
        }
        if (status === 'in progress') return 'bg-[#1767AA] text-[#27D6FF]'
        if (status === 'completed')   return 'bg-[#00375C] text-[#22BBDE]'
        return 'text-[#1767AA] border border-[#1767AA]'
    }

    const projectStatusClass = (status: string) => {
        if (isDark) {
            if (status === 'active')   return 'bg-[#17E58F] text-[#005B35]'
            if (status === 'paused')   return 'bg-[#E6DF14] text-[#5B4100]'
            if (status === 'planning') return 'bg-[#C017DE] text-[#40005B]'
            return 'bg-[#22BBDE] text-[#00375C]'
        }
        if (status === 'active')   return 'bg-[#005B35] text-[#17E58F] font-semibold'
        if (status === 'paused')   return 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        if (status === 'planning') return 'bg-[#40005B] text-[#D633FF] font-semibold'
        return 'bg-[#00375C] text-[#22BBDE] font-semibold'
    }

    if (loading) {
        return <div className='text-center p-10 font-montserrat'>Loading Worklists...</div>
    }

    return (
        <div className='space-y-4 md:space-y-6'>
            {/* Project Header */}
            <div className='space-y-3'>
                {/* Row 1: Label */}
                <p className={`text-sm md:text-base font-medium font-montserrat ${theme.textMuted}`}>Project</p>

                {/* Row 2: 2 columns */}
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>

                    {/* Col 1: Title, description (xl only), info */}
                    <div className='space-y-2 flex-1 min-w-0'>
                        <div className='flex items-center gap-4 min-w-0'>
                            <h1 className={`min-w-0 truncate text-2xl md:text-3xl xl:text-4xl font-semibold font-montserrat ${theme.text}`}>{project?.name}</h1>
                            <span className={`shrink-0 px-4 py-1 rounded-full text-sm font-semibold font-montserrat ${projectStatusClass(project?.status || '')}`}>
                                {(project?.status ?? '').charAt(0).toUpperCase() + (project?.status ?? '').slice(1)}
                            </span>
                        </div>

                        <p className={`max-w-2xl text-sm md:text-base opacity-80 font-montserrat ${theme.text}`}>{project?.description}</p>

                        <div className={`flex flex-wrap items-center gap-6 text-sm md:text-base font-medium font-montserrat ${theme.textMuted}`}>
                            <div className='flex items-center gap-2'><Users size={18} /> {project?.members} members</div>
                            <div className='flex items-center gap-2'><FileText size={18} /> {project?.worklists} worklists</div>
                            <div className='flex items-center gap-2'><Bug size={18} /> {project?.findings} findings</div>
                        </div>
                    </div>

                    {/* Col 2: Buttons — row 1: Edit + Manage, row 2: Delete */}
                    <div className='flex flex-col gap-2 shrink-0 items-start md:items-end'>
                        <div className='flex gap-2'>
                            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm font-montserrat ${theme.buttonPrimary}`}>
                                <Pencil size={16} /> Edit Project
                            </button>
                            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm font-montserrat ${theme.buttonOutline}`}>
                                <Users size={16} /> Manage Members
                            </button>
                        </div>
                        <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm font-montserrat ${theme.buttonDanger}`}>
                            <Trash2 size={16} /> Delete Project
                        </button>
                    </div>

                </div>
            </div>

            {/* Search & Status Filter */}
            <div className='flex flex-col lg:flex-row items-stretch gap-4'>
                <div className={`flex items-center gap-2 flex-1 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 border ${
                    isDark ? 'bg-gradient-to-br from-white/15 to-[#C2C2C2]/8 border-white/40' : 'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border-[#27D6FF]/40'
                }`}>
                    <Search size={18} className={`shrink-0 ${isDark ? 'text-white' : 'text-[#0F65AD]'}`} />
                    <input
                        type='text'
                        placeholder='Search worklist ...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full bg-transparent text-sm md:text-base font-montserrat focus:outline-none ${
                            isDark ? 'text-white placeholder:text-white/50' : 'text-[#002C49] placeholder:text-[#002C49]/40'
                        }`}
                    />
                </div>
                <CustomSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                        { value: 'all',         label: 'All Status'  },
                        { value: 'in progress', label: 'In Progress' },
                        { value: 'not started', label: 'Not Started' },
                        { value: 'completed',   label: 'Completed'   },
                    ]}
                    isDark={isDark}
                />
                <button className={`flex items-center justify-center gap-2 rounded-lg md:rounded-xl px-4 py-2.5 text-sm md:text-base font-semibold font-montserrat ${theme.buttonPrimary}`}>
                    <FilePlusCorner size={18} /> Add Worklist
                </button>
            </div>

            {/* Worklist List */}
            <div className='grid gap-4 font-montserrat'>
                {filteredWorklists.length > 0 ? (
                    filteredWorklists.map((worklist) => (
                        <Link
                            key={worklist.id}
                            to={`/projects/${projectId}/worklists/${worklist.id}/findings`}
                            className={`block rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 transition hover:scale-[1.01] ${theme.cardBase}`}
                        >
                            <div className='flex items-center justify-between gap-4'>
                                <div className='min-w-0'>
                                    <h3 className={`text-base md:text-lg xl:text-xl font-semibold ${theme.text}`}>{worklist.name}</h3>
                                    <p className={`mt-0.5 text-sm md:text-base font-medium ${theme.textMuted}`}>{worklist.code}</p>
                                </div>
                                <div className='flex items-center gap-3 shrink-0'>
                                    <div className={`flex items-center gap-1.5 text-sm font-medium ${theme.textMuted}`}>
                                        <Bug size={16} /> {worklist.findings} finding{worklist.findings !== 1 ? 's' : ''}
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${badgeClass(worklist.status)}`}>
                                        {worklist.status.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </span>
                                    <button
                                        onClick={(e) => e.preventDefault()}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs md:text-sm font-medium font-montserrat ${theme.buttonOutline}`}
                                    >
                                        <Trash2 size={14} /> Delete Worklist
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className={`rounded-xl p-8 text-center ${theme.cardBase}`}>
                        No worklists found.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Worklist
