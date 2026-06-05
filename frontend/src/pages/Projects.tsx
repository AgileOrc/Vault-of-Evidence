import { useEffect, useState } from 'react'
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
    members: number
    worklists: number
    findings: number
    status: string
    describtion: string
}

function Projects () {
    const { isDark } = useOutletContext<LayoutContext>()
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const [projects, setProjects] = useState<ProjectData[]>([])

    //ini jujur aku blm tau bener apa engganya, tolong di koreksi ges kalo salah
    useEffect(() => {
        api.get('/projects/lists')
            .then((res) => {
                setProjects(res.data.projects)
                setLoading(false)
            })
            .catch(() => {
                setProjects([
                    {
                        id: '1',
                        name: 'mycompany.com (Dummy)',
                        type: 'Web Application',
                        members: 5,
                        worklists: 6,
                        findings: 23,
                        status: 'Active',
                        describtion: 'Web application penetration testing for mycompany.com e-commerce platform. Covers authentication, authorization, session management, and business logic testing.'
                    },
                    {
                        id: '2',
                        name: 'api.startup.io (Dummy)',
                        type: 'API Security',
                        members: 3,
                        worklists: 4,
                        findings: 11,
                        status: 'Active',
                        describtion: '-'
                    },
                    {
                        id: '3',
                        name: 'staging.app.io (Dummy)',
                        type: 'Web Application',
                        members: 4,
                        worklists: 7,
                        findings: 15,
                        status: 'Paused',
                        describtion: '-'
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
            cardBase: 'bg-gradient-to-br from-[#294B63] via-[#173B56] to-[#0B2E46] border border-[#2BA7D6]/40 text-[#F5F5F5] shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
            greetings: 'text-[#FFFFFF]',
            titles: 'text-[#FFFFFF]',
            info: 'text-[#41B0EC]',
            buttonNewProject: 'bg-[#41B0EC] text-[#FFFFFF] hover:bg-[#0EB8DF] hover:text-white',
        }
        : {
            cardBase: 'bg-linear-to-br from-[#F5F5F5] to-[#27D6FF]/20 border border-[#27D6FF]/40 text-[#002C49] shadow-md',
            greetings: 'text-[#002C49]',
            titles: 'text-[#002C49]',
            info: 'text-[#0E65AD]',
            buttonNewProject: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-white',
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
                <div>
                    <h1 className={`text-2xl md:text-3xl xl:text-4xl font-semibold font-montserrat ${theme.greetings}`}>Your Projects</h1>
                    <p className={`mt-1 text-sm md:text-base xl:text-lg opacity-80 font-montserrat ${theme.greetings}`}>All penetration testing engagements.</p>
                </div>
                
                <Link
                    to={`/projects/new`} 
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 md:px-4 md:py-2 xl:px-5 xl:py-3 text-sm md:text-base font-semibold font-montserrat ${theme.buttonNewProject}`}>
                    <Plus className='h-4 w-4' /> New Project
                </Link>
            </header>

            {/* Search & Status Filter */}
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search
                        size={18}
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-[#0F65AD]'
                    />

                    <input
                        type='text'
                        placeholder='Search Projects...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full rounded-lg md:rounded-xl pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border font-Montserrat focus:outline-none focus:ring-2 ${
                            isDark ? 'bg-[#173B56] border-[#2BA7D6]/40 text-white focus:ring-[#2BA7D6]' : 'bg-white border-[#1767AA]/30 text-[#002C49] focus:ring-[#20A6DA]'}
                        `}
                    />
                </div>

                <div className='relative w-full md:w-56 lg:w-48'>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`appearance-none w-full rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 pr-10 text-sm md:text-base border font-montserrat focus:outline-none focus:ring-2 ${
                            isDark ? 'bg-[#173B56] border-[#2BA7D6]/40 text-white focus:ring-[#2BA7D6]' : 'bg-white border-[#1767AA]/30 text-[#002C49] focus:ring-[#20A6DA]'}
                        `}
                    >
                        <option value='all'>All Status</option>
                        <option value='active'>Active</option>
                        <option value='paused'>Paused</option>
                        <option value='completed'>Completed</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
                    />
                </div>
            </div>

            {/* Project List */}
            <div className='grid gap-4'>
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}/worklists`}
                            className={`block rounded-xl md:rounded-2xl p-4 md:p-6 transition hover:scale-[1.01] ${theme.cardBase}`}
                        >
                            <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>
                                <div>
                                    <h3 className={`text-lg md:text-xl xl:text-2xl font-semibold ${theme.titles}`}> {project.name} </h3>
                                
                                    <div className='mt-3 flex flex-wrap items-center gap-2 md:gap-4 xl:gap-5 text-xs md:text-sm xl:text-base'>
                                        <div className={`flex items-center gap-1 ${theme.info}`}>
                                            <Globe size={16} />
                                            <span>{project.type}</span>
                                        </div>

                                        <div className={`flex items-center gap-1 ${theme.info}`}>
                                            <Users size={16} />
                                            <span>{project.members} members</span>
                                        </div>

                                        <div className={`flex items-center gap-1 ${theme.info}`}>
                                            <FileText size={16} />
                                            <span>{project.worklists} worklists</span>
                                        </div>

                                        <div className={`flex items-center gap-1 ${theme.info}`}>
                                            <Bug size={16} />
                                            <span>{project.findings} findings</span>
                                        </div>
                                    </div>
                                </div>

                                <span className={`rounded-full px-3 md:px-4 xl:px-5 py-1 text-xs md:text-sm font-semibold ${
                                    badgeClass(project.status)}`}
                                >
                                    {project.status}
                                </span>
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