import { useEffect, useState } from 'react'
import {
    Search,
    User, 
    ChevronDown,
    Trash2,
    FilePlusCorner,
    Pencil,
    Calendar
} from 'lucide-react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'
import api from '../api/axios'

type ProjectData = {
    id: string
    name: string
}

type WorklistData = {
    id: string
    name: string
    code: string
    status: string
}

type FindingData = {
    id: string
    name: string
    code: string
    status: string
    confirmDate: string
    severity: string
    member: string
}

function Findings () {
    const { isDark } = useOutletContext<LayoutContext>()
    const [loading, setLoading] = useState(true)
    
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [severityFilter, setSeverityFilter] = useState('all')

    const [project, setProject] = useState<ProjectData | null>(null)
    const [worklists, setWorklists] = useState<WorklistData | null>(null)
    const [findings, setFindings] = useState<FindingData[]>([])
    const { projectId } = useParams()
    const { worklistId } = useParams()

    useEffect(() => {
        api.get(`/projects/${projectId}/worklists/${worklistId}`)
            .then((res) => {
                setProject(res.data.project)
                setWorklists(res.data.worklist)
                setFindings(res.data.findings)
                setLoading(false)
            })
            .catch(() => {
                setProject({
                    id: projectId || '1',
                    name: 'mycompany.com (Dummy)'
                })

                setWorklists({
                    id: worklistId || '1',
                    name: 'Login Page',
                    code: 'WSTG-ATHN, WSTG-SESS',
                    status: 'In Progress'
                })

                setFindings([
                    {
                        id: '1',
                        name: 'SQL Injection on /api/v1/auth/login',
                        code: 'WSTG-ATHN-01',
                        status: 'Confirmed',
                        confirmDate: '2 May 2026',
                        severity: 'Critical',
                        member: 'Bob'
                    },
                    {
                        id: '2',
                        name: 'Weak Lock Out Mechanism on /api/v1/auth/login',
                        code: 'WSTG-ATHZ',
                        status: 'Open',
                        confirmDate: '3 May 2026',
                        severity: 'Medium',
                        member: 'Carol'
                    },
                    {
                        id: '3',
                        name: 'Search Feature',
                        code: 'WSTG-INPV',
                        status: 'Fixing',
                        confirmDate: '5 May 2026',
                        severity: 'High',
                        member: 'Bob'
                    },
                    {
                        id: '4',
                        name: 'Register Page',
                        code: 'WSTG-IDNT',
                        status: 'Fixed',
                        confirmDate: '7 May 2026',
                        severity: 'Medium',
                        member: 'Carol'
                    },
                    {
                        id: '5',
                        name: 'Forgot Password',
                        code: 'WSTG-ATHN',
                        status: 'Closed on Notes',
                        confirmDate: '8 May 2026',
                        severity: 'Low',
                        member: 'Bob'
                    }
                ])

                setLoading(false)
            })
    }, [worklistId])

    const filteredFindings = findings.filter((finding) => {
         const matchSearch = finding.name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchStatus = statusFilter === 'all' || finding.status.toLowerCase() === statusFilter.toLowerCase()

        const matchSeverity = severityFilter === 'all' || finding.severity.toLowerCase() === severityFilter.toLowerCase()

        return matchSearch && matchStatus && matchSeverity
    })

    const theme = isDark
        ? {
            cardBase: 'bg-gradient-to-br from-[#294B63] via-[#173B56] to-[#0B2E46] border border-[#2BA7D6]/40 text-[#F5F5F5] shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
            projectName: 'text-[#FFFFFF]',
            findingDetails: 'text-[#41B0EC]',
            buttonDelete: 'text-[#EC2828] hover:text-[#FFFFFF] hover:bg-[#EC2828]',
            buttonEditWorklist: 'bg-[#41B0EC] text-[#FFFFFF] hover:bg-[#27D6FF] hover:text-[#FFFFFF]',
            buttonAddFinding: 'bg-[#41B0EC] text-[#FFFFFF] hover:bg-[#27D6FF] hover:text-[#FFFFFF]',
            buttonDeleteFinding: 'text-[#41B0EC] border border-[#41B0EC] hover:text-[#FFFFFF] hover:bg-[#27D6FF]'
        }
        : {
            cardBase: 'bg-linear-to-br from-[#F5F5F5] to-[#27D6FF]/20 border border-[#27D6FF]/40 text-[#002C49] shadow-md',
            projectName: 'text-[#002C49]',
            findingDetails: 'text-[#0E65AD]',
            buttonDelete: 'bg-[#FFFFFF] text-[#EC2828] hover:text-[#FFFFFF] hover:bg-[#EC2828]',
            buttonEditWorklist: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-[#FFFFFF]',
            buttonAddFinding: 'bg-[#1767AA] text-[#FFFFFF] hover:bg-[#41B0EC] hover:text-[#FFFFFF]',
            buttonDeleteFinding: 'text-[#1767AA] border border-[#1767AA] hover:text-[#FFFFFF] hover:bg-[#41B0EC]'
        }
    const badgeClass = (status: string) => {
        if (isDark) {
            if (status === 'Confirmed')
                return 'bg-[#DCF3F8] text-[#1767AA]'

            if (status === 'Fixing')
                return 'bg-[#27D6FF] text-[#1767AA]'

            if (status === 'Fixed')
                return 'bg-[#DCF3F8] text-[#002C49]'

            if (status === 'Closed on Notes')
                return 'bg-[#27D6FF] text-[#00375C]'

            return 'text-[#27D6FF] border border-[#27D6FF]'
        }
        
        if (status === 'Confirmed') return 'bg-[#1767AA] text-[#F5F5F5]'
        if (status === 'Fixing') return 'bg-[#1767AA] text-[#27D6FF]'
        if (status === 'Fixed') return 'bg-[#002C49] text-[#DCF3F8]'
        if (status === 'Closed on Notes') return 'bg-[#00375C] text-[#22BBDE]'
        return 'text-[#1767AA] border border-[#1767AA]'
    }
    const severityClass = (severity: string) => {
        if (severity === 'Critical') return isDark ? 'bg-[#EC2828] text-[#5B0000]' : 'bg-[#5B0000] text-[#EC2828] font-semibold'
        if (severity === 'High') return isDark ? 'bg-[#E67219] text-[#5B3000]' : 'bg-[#5B3100] text-[#E67219] font-semibold'
        if (severity === 'Medium') return isDark ? 'bg-[#E6DF14] text-[#5B4100]' : 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        return isDark ? 'bg-[#17E58F] text-[#005B35]' : 'bg-[#005B35] text-[#17E58F] font-semibold'
    }
    const worklistStatus = (status: string) => {
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
    
    if (loading) {
        return <div className='text-center p-10 font-montserrat'>Loading Findings...</div>
    }

    return (
        <div className='space-y-1'>
            <h1 className={`text-xl xl:text-2xl font-semibold font-montserrat ${theme.projectName}`}>{project?.name}</h1>

            <div className='flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6'>
                <div className='space-y-2 flex-1 min-w-0'>
                    <div className='flex flex-wrap items-center gap-14 min-w-0'>
                        <h2 className={`min-w-0 truncate text-3xl xl:text-5xl font-semibold font-montserrat ${theme.projectName}`}>
                            {worklists?.name}
                        </h2>

                        <span className={`shrink-0 px-5 py-1 rounded-full font-semibold font-montserrat ${worklistStatus(worklists?.status || '')}`}>
                            In Progress
                        </span>
                    </div>

                    <p className={`max-w-4xl text-base xl:text-lg opacity-90 font-medium font-montserrat ${theme.projectName}`}>
                        {worklists?.code}
                    </p>
                </div>

                <div className='flex flex-wrap gap-6 shrink-0'>
                    <button className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold font-montserrat ${theme.buttonEditWorklist}`}>
                        <Pencil size={18} /> Edit Project
                    </button>

                    <button className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold font-montserrat ${theme.buttonDelete}`}>
                        <Trash2 size={18} /> Delete Project
                    </button>
                </div>
            </div>

            {/* Search, Status, and Severity Filter */}
            <div className='mt-5 flex flex-col lg:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search
                        size={18}
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-[#0F65AD]'
                    />

                    <input
                        type='text'
                        placeholder='Search Finding...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full rounded-lg md:rounded-xl pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border font-Montserrat focus:outline-none focus:ring-2 ${
                            isDark ? 'bg-[#1767AA]/20 border-[#2BA7D6] text-white focus:ring-[#2BA7D6]' : 'bg-[#27D6FF]/10 border-[#1767AA] text-[#0F65AD] focus:ring-[#20A6DA]'}
                        `}
                    />
                </div>

                <div className='relative md:w-48 lg:w-36'>
                    <select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className={`appearance-none w-full rounded-lg md:rounded-xl pl-7 py-2.5 md:py-3 text-sm md:text-base border font-Montserrat focus:outline-none focus:ring-2 ${
                            isDark ? 'bg-[#1767AA]/20 border-[#2BA7D6] text-white focus:ring-[#2BA7D6]' : 'bg-[#27D6FF]/10 border-[#1767AA] text-[#0F65AD] focus:ring-[#20A6DA]'}
                        `}
                    >
                        <option value='all' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >All Severity</option>

                        <option value='critical' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Critical</option>

                        <option value='high' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >High</option>

                        <option value='medium' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Medium</option>

                        <option value='low' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Low</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
                    />
                </div>

                <div className='relative md:w-48 lg:w-36'>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`appearance-none w-full rounded-lg md:rounded-xl pl-7 py-2.5 md:py-3 text-sm md:text-base border font-Montserrat focus:outline-none focus:ring-2 ${
                            isDark ? 'bg-[#1767AA]/20 border-[#2BA7D6] text-white focus:ring-[#2BA7D6]' : 'bg-[#27D6FF]/10 border-[#1767AA] text-[#0F65AD] focus:ring-[#20A6DA]'}
                        `}
                    >
                        <option value='all' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >All Status</option>

                        <option value='open' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Open</option>

                        <option value='fixing' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Fixing</option>

                        <option value='fixed' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Fixed</option>

                        <option value='closed on notes' className={`font-montserrat ${ 
                            isDark ? 'bg-[#0B2E46] text-white' : 'bg-[#27D6FF]/20 text-[#002C49]'}`}
                        >Closed on Notes</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'
                    />
                </div>
                
                <button className={`flex items-center rounded-lg md:rounded-xl px-3 md:px-2 xl:px-4 py-1 gap-2 text-xs md:text-sm xl:text-lg font-medium font-montserrat ${theme.buttonAddFinding}`}>
                    <FilePlusCorner size={20} /> Add Finding
                </button>
            </div>

            {/* Finding List */}
            <div className='mt-8 grid gap-4'>
                {filteredFindings.length > 0 ? (
                    filteredFindings.map((finding) => (
                        <Link
                            key={finding.id}
                            to={`/projects/${projectId}/worklists/${worklistId}/finding/${finding.id}`}
                            className={`block rounded-xl md:rounded-2xl p-4 md:p-6 transition hover:scale-[1.01] ${theme.cardBase}`}
                        >
                            <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>
                                <div>
                                    <h3 className={`text-lg md:text-xl xl:text-2xl font-semibold font-montserrat ${theme.projectName}`}> {finding.name} </h3>

                                    <div className={`mt-2 flex flex-wrap items-center gap-6 text-lg md:text-lg xl:text-xl font-medium font-montserrat ${theme.findingDetails}`}> 
                                        <span> {finding.code} </span>

                                        <span className='inline-flex items-center gap-2'>
                                            <Calendar size={18} /> {finding.confirmDate}
                                        </span>

                                        <span className='inline-flex items-center gap-2'>
                                            <User size={18} /> {finding.member}
                                        </span>
                                    </div>
                                </div>

                                <div className='mt-3 flex items-center flex-nowrap gap-3 md:gap-5 xl:gap-6 text-xs md:text-sm xl:text-base'>
                                    <span className={`rounded-full px-3 md:px-4 xl:px-6 py-1 text-xs md:text-lg font-semibold ${
                                        severityClass(finding.severity)}`}
                                    >
                                        {finding.severity}
                                    </span>

                                    <span className={`shrink-0 rounded-full px-3 md:px-4 xl:px-6 py-1 text-xs md:text-lg font-semibold ${
                                        badgeClass(finding.status)}`}
                                    >
                                        {finding.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className={`rounded-xl p-8 text-center ${theme.cardBase}`}>
                        No finding found.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Findings