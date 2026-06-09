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

const btnBase = 'flex items-center gap-2 px-2 md:px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-md md:rounded-lg border font-semibold text-xs xl:text-sm font-montserrat'
const iconSize = 'w-3 h-3 md:w-4 md:h-4'

function Worklist () {
    const { isDark, isCollapsed } = useOutletContext<LayoutContext>()
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [project, setProject] = useState<ProjectData | null>(null)
    const [worklists, setWorklists] = useState<WorklistData[]>([])
    const { projectId } = useParams()

    useEffect(() => {
        Promise.all([
            api.get(`/projects/${projectId}`),
            api.get(`/projects/${projectId}/worklists`)
        ])
        .then(([projectRes, worklistsRes]) => {
            const wList = worklistsRes.data.data || [];
            const mappedWorklists = wList.map((w: any) => ({
                ...w,
                findings: w.findings ? w.findings.length : 0
            }))
            
            const p = projectRes.data.data;
            setProject({
                ...p,
                members: p.members ? p.members.length : 0,
                worklists: wList.length,
                findings: mappedWorklists.reduce((acc: number, curr: any) => acc + curr.findings, 0)
            })
            
            setWorklists(mappedWorklists)
            setLoading(false)
        })
        .catch((err) => {
            console.error('Failed to load worklists:', err)
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
            <div className='space-y-2'>
                {/* Row 1: Label */}
                <p className={`text-xl md:text-2xl xl:text-3xl font-semibold font-montserrat ${theme.text}`}>Project</p>

                {/* Row 2: 2 columns */}
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>

                    {/* Col 1: Title, description (xl only), info */}
                    <div className='space-y-2 md:flex-4 lg:flex-3 min-w-0'>
                        <div className='flex items-center gap-4 min-w-0'>
                            <h1 className={`min-w-0 truncate text-2xl md:text-3xl xl:text-4xl font-semibold font-montserrat ${theme.text}`}>{project?.name}</h1>
                            <span className={`shrink-0 px-4 py-1 rounded-full text-sm font-semibold font-montserrat ${projectStatusClass(project?.status || '')}`}>
                                {(project?.status ?? '').charAt(0).toUpperCase() + (project?.status ?? '').slice(1)}
                            </span>
                        </div>

                        <p className={`text-sm md:text-base font-montserrat ${theme.text}`}>{project?.description}</p>

                        <div className={`flex flex-wrap items-center gap-2 lg:gap-6 text-sm md:text-base font-medium font-montserrat ${theme.textMuted}`}>
                            <div className='flex items-center gap-2'><Users size={18} /> {project?.members} members</div>
                            <div className='flex items-center gap-2'><FileText size={18} /> {project?.worklists} worklists</div>
                            <div className='flex items-center gap-2'><Bug size={18} /> {project?.findings} findings</div>
                        </div>
                    </div>

                    {/* Col 2: Buttons */}
                    <div className='flex-2 gap-2 shrink-0 items-start md:items-end justify-end'>
                        <div className={`flex flex-col gap-2 items-start md:items-end justify-end ${isCollapsed ? 'flex-col xl:flex-row' : 'flex-col'}`}>
                            
                            {/* Edit + Manage */}
                            <div className={`flex gap-2 md:items-end ${isCollapsed ? 'flex-row md:flex-col lg:flex-row ' : 'flex-row md:flex-col xl:flex-row'}`}>
                                <button className={`${btnBase} ${theme.buttonPrimary}`}>
                                    <Pencil className={iconSize} /> Edit Project
                                </button>
                                <button className={`${btnBase} ${theme.buttonOutline}`}>
                                    <Users className={iconSize} /> Manage Members
                                </button>
                            </div>

                            {/* Delete */}
                            <button className={`${btnBase} ${theme.buttonDanger} w-fit`}>
                                <Trash2 className={iconSize} /> Delete Project
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Status Filter */}
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className={`flex gap-2 flex-1 rounded-lg md:rounded-xl px-3 md:px-4 py-2 lg:py-1 xl:py-3 border ${
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
                <div className='flex gap-4 max-w-screen md:w-fit lg:w-auto'>
                    <div className='flex-1 min-w-0'>
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
                    </div>
                    <button className={`${btnBase} justify-center border-transparent ${theme.buttonPrimary}`}>
                        <FilePlusCorner className={`w-4 h-4 lg:w-5 lg:h-5`} /> Add Worklist
                    </button>
                            
                </div>
                
            </div>

            {/* Worklist List */}
            <div className='grid gap-6 md:gap-4 font-montserrat'>
                {filteredWorklists.length > 0 ? (
                    filteredWorklists.map((worklist) => (
                        <Link
                            key={worklist.id}
                            to={`/projects/${projectId}/worklists/${worklist.id}/findings`}
                            className={`block rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 transition hover:scale-[1.01] ${theme.cardBase}`}
                        >
                            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4'>
                                {/* Worklist Title & Code */}
                                <div className='flex flex-col min-w-0'>
                                    <h3 className={`text-xl md:text-xl xl:text-[1.3rem] font-semibold ${theme.text}`}>{worklist.name}</h3>
                                    <p className={`mt-0.5 text-sm md:text-base font-medium ${theme.textMuted}`}>{worklist.code}</p>
                                </div>
                                {/* Worklist findings, status, delete worklist button */}
                                <div className={`flex flex-col gap-3 shrink-0 items-start ${
                                    isCollapsed ? 'md:flex-row md:items-center' : 'md:flex-col md:items-end lg:flex-row lg:items-center'
                                }`}>
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
