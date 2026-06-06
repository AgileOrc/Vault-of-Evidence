import { useEffect, useState } from 'react'
import {
    Users,
    FileText,
    Bug,
    Search, 
    ChevronDown,
    Trash2,
    FilePlusCorner,
    Pencil
} from 'lucide-react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
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
                    describtion: 'Web application penetration testing for mycompany.com e-commerce platform. Covers authentication, authorization, session management, and business logic testing.',
                    type: 'Web Application',
                    members: 5,
                    worklists: 5,
                    findings: 10,
                    status: 'Active'
                })
                
                setWorklists([
                    {
                        id: '1',
                        name: 'Login Page (Dummy)',
                        code: 'WSTG-ATHN, WSTG-SESS',
                        findings: 3,
                        status: 'In Progress'
                    },
                    {
                        id: '2',
                        name: 'User Profile (Dummy)',
                        code: 'WSTG-ATHZ',
                        findings: 1,
                        status: 'In Progress'
                    },
                    {
                        id: '3',
                        name: 'Search Feature (Dummy)',
                        code: 'WSTG-INPV',
                        findings: 2,
                        status: 'In Progress'
                    },
                    {
                        id: '4',
                        name: 'Register Page (Dummy)',
                        code: 'WSTG-IDNT',
                        findings: 4,
                        status: 'Completed'
                    },
                    {
                        id: '5',
                        name: 'Forgot Password (Dummy)',
                        code: 'WSTG-ATHN',
                        findings: 0,
                        status: 'Not Started'
                    },
                ])
                
                setLoading(false)
            })
    }, [projectId])

    const filteredWorklists = worklists.filter((worklist) => {
        const matchSearch = worklist.name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchStatus = statusFilter === 'all' || worklist.status.toLowerCase() === statusFilter.toLowerCase()

        return matchSearch && matchStatus
    })

    const theme = isDark
        ? {
            cardBase: 'bg-gradient-to-br from-[#294B63] via-[#173B56] to-[#0B2E46] border border-[#2BA7D6]/40 text-[#F5F5F5] shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
            projectName: 'text-[#FFFFFF]',
            projectDetails: 'text-[#41B0EC]',
            buttonManage: 'text-[#41B0EC] hover:text-[#FFFFFF] hover:bg-[#0EB8DF]',
            buttonDelete: 'text-[#EC2828] hover:text-[#FFFFFF] hover:bg-[#EC2828]',
            buttonEditProject: 'bg-[#41B0EC] text-[#FFFFFF] hover:bg-[#27D6FF] hover:text-[#FFFFFF]',
            buttonAddWorklist: 'bg-[#41B0EC] text-[#FFFFFF] hover:bg-[#27D6FF] hover:text-[#FFFFFF]',
            buttonDeleteWorklist: 'text-[#41B0EC] border border-[#41B0EC] hover:text-[#FFFFFF] hover:bg-[#27D6FF]'
        }
        : {
            cardBase: 'bg-linear-to-br from-[#F5F5F5] to-[#27D6FF]/20 border border-[#27D6FF]/40 text-[#002C49] shadow-md',
            projectName: 'text-[#002C49]',
            projectDetails: 'text-[#0E65AD]',
            buttonManage: 'bg-[#FFFFFF] text-[#1767AA] hover:text-[#FFFFFF] hover:bg-[#41B0EC]',
            buttonDelete: 'bg-[#FFFFFF] text-[#EC2828] hover:text-[#FFFFFF] hover:bg-[#EC2828]',
            buttonEditProject: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-[#FFFFFF]',
            buttonAddWorklist: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-[#FFFFFF]',
            buttonDeleteWorklist: 'text-[#1767AA] border border-[#1767AA] hover:text-[#FFFFFF] hover:bg-[#41B0EC]'
        }
    const badgeClass = (status: string) => {
        if (isDark) {
            if (status === 'In Progress')
                return 'bg-[#27D6FF] text-[#136AB2]'

            if (status === 'Completed')
                return 'bg-[#136AB2] text-[#F5F5F5]'

            return 'text-[#27D6FF] border border-[#27D6FF]'
        }
        
        if (status === 'In Progress') return 'bg-[#1767AA] text-[#27D6FF]'
        if (status === 'Completed') return 'bg-[#00375C] text-[#22BBDE]'
        return 'text-[#1767AA] border border-[#1767AA]'
    }
    const projectStatus = (status: string) => {
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
        return <div className='text-center p-10 font-montserrat'>Loading Worklists...</div>
    }


    return (
        <div className='space-y-1'>
            <h1 className={`text-2xl xl:text-3xl font-semibold font-montserrat ${theme.projectName}`}>Project</h1>
            
            <div className='flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6'>
                <div className='space-y-2 flex-1 min-w-0'>
                    <div className='flex items-center gap-6 min-w-0'>
                        <h2 className={`min-w-0 truncate text-2xl xl:text-3xl font-semibold font-montserrat ${theme.projectName}`}> {project?.name} </h2>
                    
                        <span className={`shrink-0 px-6 py-2 rounded-full font-semibold font-montserrat ${projectStatus(project?.status || '')}`}>Active</span>
                    </div>

                    <p className={`max-w-4xl text-base xl:text-lg opacity-80 font-montserrat ${theme.projectName}`}>{project?.describtion}</p>
                
                    <div className={`flex flex-wrap items-center gap-8 text-base xl:text-lg font-medium font-montserrat ${theme.projectDetails}`}>
                        <div className='flex items-center gap-2'>
                            <Users size={20} /> {project?.members} members
                        </div>

                        <div className='flex items-center gap-2'>
                            <FileText size={20} /> {project?.worklists} worklists
                        </div>

                        <div className='flex items-center gap-2'>
                            <Bug size={20} /> {project?.findings} findings
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-wrap justify-end gap-4 shrink-0 w-fit'>
                    <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold font-montserrat ${theme.buttonEditProject}`}>
                        <Pencil size={18} /> Edit Project
                    </button>

                    <button className={`flex items-center gap-2 px-3 py-3 rounded-xl border font-semibold font-montserrat ${theme.buttonManage}`}>
                        <Users size={18} /> Manage Members
                    </button>
                        
                    <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold font-montserrat ${theme.buttonDelete}`}>
                        <Trash2 size={18} /> Delete Project
                    </button>
                </div>
            </div>

            {/* Search & Status Filter */}
            <div className='mt-2 flex flex-col lg:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search
                        size={18}
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-[#0F65AD]'
                    />

                    <input
                        type='text'
                        placeholder='Search Worklist...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full rounded-lg md:rounded-xl pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border font-Montserrat focus:outline-none focus:ring-2 ${
                            isDark ? 'bg-[#1767AA]/20 border-[#2BA7D6] text-white focus:ring-[#2BA7D6]' : 'bg-[#27D6FF]/10 border-[#1767AA] text-[#0F65AD] focus:ring-[#20A6DA]'}
                        `}
                    />
                </div>

                <div className='relative w-full md:w-56 lg:w-48'>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`appearance-none w-full rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 pr-10 text-sm md:text-base border font-montserrat focus:outline-none focus:ring-2 ${
                            isDark ? 'bg-[#1767AA]/20 border-[#2BA7D6] text-white focus:ring-[#2BA7D6]' : 'bg-[#27D6FF]/10 border-[#1767AA] text-[#0F65AD] focus:ring-[#20A6DA]'}
                        `}
                    >
                        <option value='all' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >All Status</option>

                        <option value='in progress' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >In Progress</option>

                        <option value='not started' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Not Started</option>

                        <option value='completed' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Completed</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
                    />
                </div>

                <button className={`flex items-center rounded-lg md:rounded-xl px-3 md:px-2 xl:px-4 py-1 gap-2 text-xs md:text-sm xl:text-lg font-medium font-montserrat ${theme.buttonAddWorklist}`}>
                    <FilePlusCorner size={20} /> Add Worklist
                </button>
            </div>

            {/* Worklist List */}
            <div className='mt-8 grid gap-4'>
                {filteredWorklists.length > 0 ? (
                    filteredWorklists.map((worklist) => (
                        <Link
                            key={worklist.id}
                            to={`/projects/${projectId}/worklists/${worklist.id}/findings`}
                            className={`block rounded-xl md:rounded-2xl p-4 md:p-6 transition hover:scale-[1.01] ${theme.cardBase}`}
                        >
                            <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>
                                <div>
                                    <h3 className={`text-lg md:text-xl xl:text-2xl font-semibold font-montserrat ${theme.projectName}`}> {worklist.name} </h3>

                                    <p className={`mt-2 text-lg md:text-lg xl:text-xl font-medium font-montserrat ${theme.projectDetails}`}> {worklist.code} </p>
                                </div>

                                <div className='mt-3 flex flex-wrap items-center gap-3 md:gap-5 xl:gap-6 text-xs md:text-sm xl:text-base'>
                                    <div className={`flex items-center gap-2 text-lg md:text-lg xl:text-xl font-medium font-montserrat ${theme.projectDetails}`}>
                                        <Bug size={20} /> {worklist.findings} findings
                                    </div>

                                    <span className={`rounded-full px-3 md:px-4 xl:px-6 py-1 text-xs md:text-lg font-semibold ${
                                        badgeClass(worklist.status)}`}
                                    >
                                        {worklist.status}
                                    </span>

                                    <button className={`flex items-center rounded-lg md:rounded-xl px-3 md:px-1 xl:px-2 py-1 gap-2 text-xs md:text-sm xl:text-lg font-medium font-montserrat ${theme.buttonDeleteWorklist}`}>
                                        <Trash2 size={20} /> Delete Worklist
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div
                        className={`rounded-xl p-8 text-center ${theme.cardBase}`}
                    >
                        No worklist found.
                    </div>
                )}
            </div>
        </div>
    )

}

export default Worklist;