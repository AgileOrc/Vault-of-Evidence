import { useEffect, useState } from 'react'
import { Search, User, Trash2, FilePlusCorner, Pencil, Calendar } from 'lucide-react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import CustomSelect from '../components/CustomSelect'
import type { LayoutContext } from '../components/AppLayout'
import api from '../api/axios'
import { getPageTheme } from '../utils/theme'
import { EditWorklistModal, DeleteWorklistModal, AddFindingModal } from '../components/PopUp'

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

const btnBase = 'flex items-center gap-2 px-2 md:px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-md md:rounded-lg border font-semibold text-xs xl:text-sm font-montserrat'
const iconSize = 'w-3 h-3 md:w-4 md:h-4'

function Findings () {
    const { isDark, isCollapsed } = useOutletContext<LayoutContext>()
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [severityFilter, setSeverityFilter] = useState('all')

    const [showEditWorklist, setShowEditWorklist] = useState(false)
    const [showAddFinding, setShowAddFinding] = useState(false)
    const [showDeleteWorklist, setShowDeleteWorklist] = useState(false)

    const [project, setProject] = useState<ProjectData | null>(null)
    const [worklist, setWorklist] = useState<WorklistData | null>(null)
    const [findings, setFindings] = useState<FindingData[]>([])
    const { projectId, worklistId } = useParams()

    useEffect(() => {
        Promise.all([
            api.get(`/projects/${projectId}`),
            api.get(`/projects/${projectId}/worklists/${worklistId}`),
            api.get(`/projects/${projectId}/worklists/${worklistId}/findings`)
        ])
        .then(([projectRes, worklistRes, findingsRes]) => {
            setProject(projectRes.data.data)
            setWorklist(worklistRes.data.data)
            
            const rawFindings = findingsRes.data.data || [];
            const mappedFindings = rawFindings.map((f: any) => ({
                id: f.id,
                name: f.title || 'Untitled',
                code: '-', // Backend doesn't have finding code yet
                status: f.status || 'open',
                confirmDate: f.created_at ? new Date(f.created_at).toLocaleDateString() : '-',
                severity: f.severity ? f.severity.charAt(0).toUpperCase() + f.severity.slice(1) : 'Low',
                member: '-' // Backend doesn't have assignee yet
            }))
            
            setFindings(mappedFindings)
            setLoading(false)
        })
        .catch((err) => {
            console.error('Failed to load findings:', err)
            setLoading(false)
        })
    }, [worklistId, projectId])

    const filteredFindings = findings.filter((finding) => {
        const matchSearch   = finding.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus   = statusFilter === 'all'   || finding.status.toLowerCase()   === statusFilter.toLowerCase()
        const matchSeverity = severityFilter === 'all' || finding.severity.toLowerCase() === severityFilter.toLowerCase()
        return matchSearch && matchStatus && matchSeverity
    })

    const theme = getPageTheme(isDark)

    const badgeClass = (status: string) => {
        if (isDark) {
            if (status === 'confirmed')       return 'bg-[#DCF3F8] text-[#1767AA]'
            if (status === 'fixing')          return 'bg-[#27D6FF] text-[#1767AA]'
            if (status === 'fixed')           return 'bg-[#DCF3F8] text-[#002C49]'
            if (status === 'closed on notes') return 'bg-[#27D6FF] text-[#00375C]'
            return 'text-[#27D6FF] border border-[#27D6FF]'
        }
        if (status === 'confirmed')       return 'bg-[#1767AA] text-[#F5F5F5]'
        if (status === 'fixing')          return 'bg-[#1767AA] text-[#27D6FF]'
        if (status === 'fixed')           return 'bg-[#002C49] text-[#DCF3F8]'
        if (status === 'closed on notes') return 'bg-[#00375C] text-[#22BBDE]'
        return 'text-[#1767AA] border border-[#1767AA]'
    }

    const severityClass = (severity: string) => {
        if (severity === 'Critical') return isDark ? 'bg-[#EC2828] text-[#5B0000]'  : 'bg-[#5B0000] text-[#EC2828] font-semibold'
        if (severity === 'High')     return isDark ? 'bg-[#E67219] text-[#5B3000]'  : 'bg-[#5B3100] text-[#E67219] font-semibold'
        if (severity === 'Medium')   return isDark ? 'bg-[#E6DF14] text-[#5B4100]'  : 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        return                              isDark ? 'bg-[#17E58F] text-[#005B35]'  : 'bg-[#005B35] text-[#17E58F] font-semibold'
    }

    const worklistStatusClass = (status: string) => {
        if (isDark) {
            if (status === 'in progress') return 'bg-[#27D6FF] text-[#136AB2]'
            if (status === 'completed')   return 'bg-[#136AB2] text-[#F5F5F5]'
            return 'text-[#27D6FF] border border-[#27D6FF]'
        }
        if (status === 'in progress') return 'bg-[#1767AA] text-[#27D6FF]'
        if (status === 'completed')   return 'bg-[#00375C] text-[#22BBDE]'
        return 'text-[#1767AA] border border-[#1767AA]'
    }

    if (loading) {
        return <div className='text-center p-10 font-montserrat'>Loading Findings...</div>
    }

    return (
        <div className='space-y-4 md:space-y-6'>

            {/* Header */}
            <div className='space-y-1'>
                {/* Project name - small label */}
                <p className={`text-sm md:text-xl font-medium font-montserrat ${theme.text}`}>
                    {project?.name}
                </p>

                {/* Worklist title row + buttons */}
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>

                    {/* Left: title + badge + code */}
                    <div className='space-y-1 min-w-0'>
                        <div className='flex items-center gap-3 flex-wrap'>
                            <h1 className={`text-2xl md:text-3xl xl:text-4xl font-semibold font-montserrat ${theme.text}`}>
                                {worklist?.name}
                            </h1>
                            <span className={`shrink-0 px-3 py-1 rounded-full text-xs md:text-sm font-semibold font-montserrat ${worklistStatusClass(worklist?.status || '')}`}>
                                {(worklist?.status ?? '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                        </div>
                        <p className={`text-sm md:text-base font-medium font-montserrat ${theme.textMuted}`}>{worklist?.code}</p>
                    </div>

                    {/* Right: Edit + Delete always 1 row */}
                    <div className='flex gap-2 md:gap-3 shrink-0'>
                        <button 
                            onClick={() => setShowEditWorklist(true)}
                            className={`${btnBase} border-transparent ${theme.buttonPrimary}`}>
                            <Pencil className={iconSize} /> Edit Worklist
                        </button>
                        <button 
                            onClick={() => setShowDeleteWorklist(true)}
                            className={`${btnBase} ${theme.buttonDanger}`}>
                            <Trash2 className={iconSize} /> Delete Worklist
                        </button>
                    </div>

                </div>
            </div>

            {/* Search & Filter */}
            <div className='flex flex-col xl:flex-row gap-3'>

                {/* Search */}
                <div className={`flex items-center gap-2 flex-1 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 border ${
                    isDark ? 'bg-gradient-to-br from-white/15 to-[#C2C2C2]/8 border-white/40' : 'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border-[#27D6FF]/40'
                }`}>
                    <Search size={18} className={`shrink-0 ${isDark ? 'text-white' : 'text-[#0F65AD]'}`} />
                    <input
                        type='text'
                        placeholder='Search finding ...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full bg-transparent text-sm md:text-base font-montserrat focus:outline-none ${
                            isDark ? 'text-white placeholder:text-white/50' : 'text-[#002C49] placeholder:text-[#002C49]/40'
                        }`}
                    />
                </div>

                {/* Filters + Add */}
                <div className='flex flex-col md:flex-row gap-3 md:w-fit'>
                    <div className='flex flex-col md:flex-row gap-3 md:w-fit'>
                        <div className='flex flex-row gap-3'>
                            <div className='flex md:flex-none xl:flex-1'>
                            <CustomSelect
                                value={severityFilter}
                                onChange={setSeverityFilter}
                                options={[
                                    { value: 'all',      label: 'All Severity' },
                                    { value: 'critical', label: 'Critical'     },
                                    { value: 'high',     label: 'High'         },
                                    { value: 'medium',   label: 'Medium'       },
                                    { value: 'low',      label: 'Low'          },
                                ]}
                                isDark={isDark}
                                className='xl:w-38'
                            />
                            </div>
                            <div className='md:flex-none xl:flex-1 min-w-0'>
                                <CustomSelect
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        { value: 'all',             label: 'All Status'      },
                                        { value: 'open',            label: 'Open'            },
                                        { value: 'confirmed',       label: 'Confirmed'       },
                                        { value: 'fixing',          label: 'Fixing'          },
                                        { value: 'fixed',           label: 'Fixed'           },
                                        { value: 'closed on notes', label: 'Closed on Notes' },
                                    ]}
                                    isDark={isDark}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowAddFinding(true)}
                            className={`${btnBase} shrink-0 border-transparent w-fit ${theme.buttonPrimary}`}>
                            <FilePlusCorner className={iconSize} /> Add Finding
                        </button>
                    </div>
                </div>
            </div>

            {/* Finding List */}
            <div className='grid gap-4 font-montserrat'>
                {filteredFindings.length > 0 ? (
                    filteredFindings.map((finding) => (
                        <Link
                            key={finding.id}
                            to={`/projects/${projectId}/worklists/${worklistId}/findings/${finding.id}`}
                            className={`block rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 transition hover:scale-[1.01] ${theme.cardBase}`}
                        >
                            <div className='flex flex-col lg:flex-row lg:items-center md:justify-between gap-2 lg:gap-4'>

                                {/* Left: name + meta */}
                                <div className='min-w-0 flex flex-col gap-1'>
                                    <h3 className={`mt-0.5 text-md md:text-lg xl:text-xl font-semibold ${theme.text}`}>
                                        {finding.name}
                                    </h3>
                                    <div className={`flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm font-medium ${theme.textMuted}`}>
                                        <span className='max-w-[100px] md:max-w-none'>{finding.code}</span>
                                        <span className='flex items-center gap-1 shrink-0'>
                                            <Calendar size={12} /> {finding.confirmDate}
                                        </span>
                                        <span className='flex items-center gap-1 shrink-0'>
                                            <User size={12} /> {finding.member}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: severity + status badges */}
                                <div className={`flex shrink-0 gap-2 ${isCollapsed ? 'md:flex-row lg:items-center md:gap-6 xl:gap-8' : 'flex-row lg:flex-col xl:flex-row md:gap-4 lg:gap-1.5 xl:gap-8 lg:items-end'}`}>
                                    <span className={`rounded-full px-2.5 md:px-5 py-0.5 md:py-1 text-xs md:text-sm font-semibold ${severityClass(finding.severity)}`}>
                                        {finding.severity}
                                    </span>
                                    <span className={`rounded-full px-2.5 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-semibold ${badgeClass(finding.status)}`}>
                                        {finding.status.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </span>
                                </div>

                            </div>
                        </Link>
                    ))
                ) : (
                    <div className={`rounded-xl p-8 text-center ${theme.cardBase}`}>
                        No findings found.
                    </div>
                )}
            </div>
            
            <EditWorklistModal
                isOpen={showEditWorklist}
                isDark={isDark}
                onClose={() => setShowEditWorklist(false)}
                worklist={worklist}
                onSubmit={(data) => console.log('edit worklist', data)}
            />

            <DeleteWorklistModal
                isOpen={showDeleteWorklist}
                isDark={isDark}
                onClose={() => setShowDeleteWorklist(false)}
                worklistName={worklist?.name ?? ''}
                onConfirm={() => console.log('delete worklist')}
            />

            <AddFindingModal
                isOpen={showAddFinding}
                isDark={isDark}
                onClose={() => setShowAddFinding(false)}
                members={[]}
                onSubmit={(data) => console.log('add finding', data)}
            />

        </div>
    )
}

export default Findings
