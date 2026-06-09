import { useEffect, useState } from 'react'
import { 
    Globe,
    Users,
    FileText,
    Bug,
    Plus, 
    Search 
} from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import CustomSelect from '../components/CustomSelect'
import type { LayoutContext } from '../components/AppLayout'
import api from '../api/axios'
import { getPageTheme, projectStatusBadge, projectStatusLabel } from '../utils/theme'
import { NewProjectModal } from '../components/PopUp'


type ProjectData = {
    id: string
    name: string
    type?: string
    members?: { id: string }[]
    worklists?: { id: string }[]
    findings?: { id: string }[]
    status: string
    description: string
}

function Projects () {
    const { isDark } = useOutletContext<LayoutContext>()
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const [showNewProject, setShowNewProject] = useState(false)

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
                    status: 'planning',
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


    const theme = getPageTheme(isDark)


    if (loading) {
        return <div className="text-center p-10 font-montserrat">Loading penetration testing engagements...</div>
    }

    return (
        <div className='space-y-4 md:space-y-6'>
            <header className='flex flex-wrap items-start justify-between gap-4'>
                <div className='flex flex-col gap-1 xl:gap-2'>
                    <h1 className={`text-2xl md:text-3xl xl:text-4xl font-semibold font-montserrat ${theme.text}`}>Your Projects</h1>
                    <p className={`text-sm md:text-base xl:text-lg font-montserrat ${theme.text}`}>All penetration testing engagements.</p>
                </div>
                
                <button
                    onClick={() => setShowNewProject(true)}
                    className={`flex items-center gap-1 xl:gap-2 rounded-md md:rounded-lg px-3 xl:px-4 py-1.5 xl:py-2 text-sm md:text-md xl:text-lg font-semibold font-montserrat ${theme.buttonPrimary}`}>
                    <Plus className='h-4 w-4' /> New Project
                </button>
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
                        { value: 'all',       label: 'All Status' },
                        { value: 'active',    label: 'Active'     },
                        { value: 'paused',    label: 'Paused'     },
                        { value: 'planning',  label: 'Upcoming'   },
                        { value: 'completed', label: 'Completed'  },
                    ]}
                    isDark={isDark}
                    className='xl:w-42'
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
                                    <h3 className={`text-lg md:text-xl xl:text-2xl font-semibold ${theme.text}`}>
                                        {project.name}
                                    </h3>
                                    <span className={`shrink-0 rounded-full px-3 xl:px-5 py-1 text-xs md:text-xs font-semibold ${projectStatusBadge(project.status, isDark)}`}>
                                        {projectStatusLabel(project.status)}
                                    </span>
                                </div>

                                {/* Row 2: textMutedrmation */}
                                <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 xl:gap-5 text-xs md:text-xs xl:text-base'>
                                    <div className={`flex items-center gap-1 ${theme.textMuted}`}>
                                        <Globe size={16} />
                                        <span>{project.type}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${theme.textMuted}`}>
                                        <Users size={16} />
                                        <span>{project.members?.length ?? 0} members</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${theme.textMuted}`}>
                                        <FileText size={16} />
                                        <span>{project.worklists?.length ?? 0} worklists</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${theme.textMuted}`}>
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
            
            <NewProjectModal
                isOpen={showNewProject}
                isDark={isDark}
                onClose={() => setShowNewProject(false)}
                onSubmit={async (data) => {
                    try {
                        await api.post('/projects', data)
                        const res = await api.get('/projects')
                        setProjects(res.data.data || [])
                    } catch (err) {
                        console.error('Failed to create project', err)
                    }
                }}
            />
            
        </div>
    )
}

export default Projects;