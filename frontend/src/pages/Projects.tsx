import { useEffect, useRef, useState } from 'react'
import { 
    Globe,
    Users,
    FileText,
    Bug,
    Plus, 
    Search, 
    ChevronDown 
} from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'
import api from '../api/axios'

type ProjectData = {
    id: string
    name: string
    type: string
    members?: { id: string }[]
    worklists: number
    findings?: { id: string }[]
    status: string
    description: string
}
type SelectOption = { value: string; label: string }

function CustomSelect({ value, onChange, options, isDark }: {
    value: string
    onChange: (val: string) => void
    options: SelectOption[]
    isDark: boolean
}) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedLabel = options.find(o => o.value === value)?.label ?? options[0].label

    return (
        <div ref={ref} className='relative shrink-0 w-full md:w-36 lg:w-48'>
            {/* Trigger Button */}
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center gap-2 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 border text-sm md:text-base font-montserrat transition-all ${
                    isDark
                        ? 'bg-gradient-to-br from-white/15 to-[#C2C2C2]/8 border-white/40 text-white'
                        : 'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border-[#27D6FF]/40 text-[#0F65AD]'
                }`}
            >
                <span className='flex-1 text-left'>{selectedLabel}</span>
                <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown List */}
            {isOpen && (
                <div className={`absolute z-50 top-full mt-1 w-full rounded-lg md:rounded-xl border overflow-hidden shadow-lg ${
                    isDark
                        ? 'bg-gradient-to-br from-white/15 to-[#C2C2C2]/8 border border-white/40 text-white shadow-[2px_2px_5px_2px_rgba(0,44,73,0.05)] backdrop-blur-lg'
                        : 'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border border-[#27D6FF]/40 text-[#002C49] shadow-[2px_2px_5px_2px_rgba(0,44,73,0.05)] backdrop-blur-lg'
                }`}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type='button'
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-3 md:px-4 py-2.5 text-sm md:text-base font-montserrat transition-colors ${
                                value === option.value
                                    ? 'bg-[#1767AA] text-white'
                                    : isDark
                                        ? 'text-white hover:bg-white/10'
                                        : 'text-[#002C49] hover:bg-[#27D6FF]/15'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function Projects () {
    const { isDark } = useOutletContext<LayoutContext>()
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const [projects, setProjects] = useState<ProjectData[]>([])

    useEffect(() => {
        api.get('/projects')
            .then((res) => {
                setProjects(res.data.data || [])
                setLoading(false)
            })
            .catch(() => {
                setProjects([
                {
                    id: '1',
                    name: 'mycompany.com (Dummy)',
                    type: 'Web Application',
                    members: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }],
                    worklists: 6,
                    findings: Array.from({ length: 23 }, (_, i) => ({ id: String(i + 1) })),
                    status: 'Active',
                    description: 'Web application penetration testing for mycompany.com e-commerce platform. Covers authentication, authorization, session management, and business logic testing.'
                },
                {
                    id: '2',
                    name: 'api.startup.io (Dummy)',
                    type: 'API Security',
                    members: [{ id: '1' }, { id: '2' }, { id: '3' }],
                    worklists: 4,
                    findings: Array.from({ length: 11 }, (_, i) => ({ id: String(i + 1) })),
                    status: 'Paused',
                    description: '-'
                },
                {
                    id: '3',
                    name: 'staging.app.io (Dummy)',
                    type: 'Web Application',
                    members: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
                    worklists: 7,
                    findings: Array.from({ length: 15 }, (_, i) => ({ id: String(i + 1) })),
                    status: 'Completed',
                    description: '-'
                }
            ])
                
                setLoading(false)
            })
    }, [])

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            statusFilter === 'all' || project.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })


    const theme = isDark
        ? {
            cardBase: 'bg-gradient-to-br from-[#F5F5F5]/15 to-[#C2C2C2]/8 border border-[#F5F5F5]/40 text-[#F5F5F5] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',
            greetings: 'text-white',
            titles: 'text-white',
            info: 'text-[#41B0EC]',
            buttonNewProject: 'bg-linear-to-br from-[#0EB8DF] to-[#138FC5] text-white hover:bg-white hover:bg-none hover:text-[#138FC5] hover:border-2 hover:border-[#0EB8DF]',
        }
        : {
            cardBase: 'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border border-[#27D6FF]/40 text-[#002C49] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',
            greetings: 'text-[#002C49]',
            titles: 'text-[#002C49]',
            info: 'font-medium text-[#0E65AD]',
            buttonNewProject: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-white hover:border hover:border-white',
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

    if (loading) {
        return <div className="text-center p-10 font-montserrat">Loading penetration testing engagements...</div>
    }

    return (
        <div className='space-y-4 md:space-y-6'>
            <header className='flex flex-wrap items-start justify-between gap-4'>
                <div className='flex flex-col gap-1 xl:gap-2'>
                    <h1 className={`text-2xl md:text-3xl xl:text-4xl font-semibold font-montserrat ${theme.greetings}`}>Your Projects</h1>
                    <p className={`text-sm md:text-base xl:text-lg font-montserrat ${theme.greetings}`}>All penetration testing engagements.</p>
                </div>
                
                <Link
                    to={`/projects/new`} 
                    className={`flex items-center gap-1 xl:gap-2 rounded-md md:rounded-lg px-3 xl:px-4 py-1.5 xl:py-2 text-sm md:text-md xl:text-lg font-semibold font-montserrat ${theme.buttonNewProject}`}>
                    <Plus className='h-4 w-4' /> New Project
                </Link>
            </header>

            {/* Search & Status Filter */}
            <div className='flex flex-col md:flex-row items-stretch sm:items-center gap-4'>
                <div className={`flex items-center gap-2 xl:gap-3 flex-1 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 border ${
                    isDark ? 'bg-gradient-to-br from-white/15 to-[#C2C2C2]/8 border-white/40' : 'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border-[#27D6FF]/40'
                }`}>
                    <Search size={18} className= {`shrink-0 ${isDark ? 'text-white' : 'text-[#0F65AD]'}`} />
                    <input
                        type='text'
                        placeholder='Search Projects...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full bg-transparent text-sm md:text-base font-montserrat focus:outline-none ${
                            isDark ? 'text-white placeholder:text-white/50' : 'text-[#002C49] placeholder:text-[#002C49]/40'
                        }`}
                    />
                </div>
                
                {/* Status Filter */}
                <CustomSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'active', label: 'Active' },
                        { value: 'paused', label: 'Paused' },
                        { value: 'completed', label: 'Completed' },
                    ]}
                    isDark={isDark}
                />
            </div>

            {/* Project List */}
            <div className='grid gap-4 font-montserrat'>
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}/worklists`}
                            className={`block rounded-xl md:rounded-2xl px-5 py-6 md:px-7 transition hover:scale-[1.01] ${theme.cardBase}`}
                        >
                            <div className='flex flex-col gap-2 w-full'>

                                {/* Row 1: Title | Badge */}
                                <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-3'>
                                    <h3 className={`text-lg md:text-xl xl:text-2xl font-semibold ${theme.titles}`}>
                                        {project.name}
                                    </h3>
                                    <span className={`shrink-0 rounded-full px-3 xl:px-5 py-1 text-xs md:text-xs font-semibold ${badgeClass(project.status)}`}>
                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </span>
                                </div>

                                {/* Row 2: Information */}
                                <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 xl:gap-5 text-xs md:text-xs xl:text-base'>
                                    <div className={`flex items-center gap-1 ${theme.info}`}>
                                        <Globe size={16} />
                                        <span>{project.type}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${theme.info}`}>
                                        <Users size={16} />
                                        <span>{project.members?.length ?? 0} members</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${theme.info}`}>
                                        <FileText size={16} />
                                        <span>{project.worklists} worklists</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${theme.info}`}>
                                        <Bug size={16} />
                                        <span>{project.findings?.length ?? 0} findings</span>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    ))
                ) : (
                    <div
                        className={`rounded-xl p-8 text-center ${theme.cardBase}`}
                    >
                        No projects found.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Projects;