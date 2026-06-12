import { useEffect, useState } from 'react'
import { Users, FileText, Bug, Search, Trash2, FilePlusCorner, Pencil } from 'lucide-react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import CustomSelect from '../components/CustomSelect'
import type { LayoutContext } from '../components/AppLayout'
import api from '../api/axios'
import { getPageTheme, projectStatusBadge, projectStatusLabel } from '../utils/theme'
import { 
    EditProjectModal, 
    ManageMembersModal,
    DeleteProjectModal, 
    AddWorklistModal,
    DeleteWorklistModal
} from '../components/PopUp'

type ProjectData = {
    id: string
    name: string
    type: string
    members: number
    memberList: MemberData[]
    worklists: number
    findings: number
    status: string
    description: string
}

type MemberData = {
    id: string
    name: string
    email: string
    role: string
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
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    
    const [showEditProject, setShowEditProject] = useState(false)
    const [showManageMembers, setShowManageMembers] = useState(false)
    const [showDeleteProject, setShowDeleteProject] = useState(false)
    const [showAddWorklist, setShowAddWorklist] = useState(false)
    const [showDeleteWorklist, setShowDeleteWorklist] = useState(false)
    const [selectedWorklist, setSelectedWorklist] = useState<WorklistData | null>(null)

    const [project, setProject] = useState<ProjectData | null>(null)
    const [worklists, setWorklists] = useState<WorklistData[]>([])
    const [memberError, setMemberError] = useState('')
    const { projectId } = useParams()

    const mapMembers = (members: any[] = []): MemberData[] => {
        return members.map((member) => ({
            id: member.user?.id ?? member.user_id,
            name: member.user?.username ?? member.user?.email ?? 'Unknown user',
            email: member.user?.email ?? '',
            role: member.role ?? 'pentester',
        })).filter((member) => member.id)
    }

    const loadProject = async () => {
        const [projectRes, worklistsRes] = await Promise.all([
            api.get(`/projects/${projectId}`),
            api.get(`/projects/${projectId}/worklists`)
        ])

        const wList = worklistsRes.data.data || []
        const mappedWorklists = wList.map((w: any) => ({
            ...w,
            findings: w.findings ? w.findings.length : 0
        }))

        const p = projectRes.data.data
        const memberList = mapMembers(p.members)
        setProject({
            ...p,
            members: memberList.length,
            memberList,
            worklists: wList.length,
            findings: mappedWorklists.reduce((acc: number, curr: any) => acc + curr.findings, 0)
        })

        setWorklists(mappedWorklists)
    }

    useEffect(() => {
        loadProject()
        .then(() => {
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
                            <span className={`shrink-0 px-4 py-1 rounded-full text-sm font-semibold font-montserrat ${projectStatusBadge(project?.status || '', isDark)}`}>
                                {projectStatusLabel(project?.status || '')}
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
                                <button 
                                    onClick={() => setShowEditProject(true)}
                                    className={`${btnBase} ${theme.buttonPrimary}`}>
                                    <Pencil className={iconSize} /> Edit Project
                                </button>
                                <button 
                                    onClick={() => setShowManageMembers(true)}
                                    className={`${btnBase} ${theme.buttonOutline}`}>
                                    <Users className={iconSize} /> Manage Members
                                </button>
                            </div>

                            {/* Delete */}
                            <button 
                                onClick={() => setShowDeleteProject(true)}
                                className={`${btnBase} ${theme.buttonDanger} w-fit`}>
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
                    <button 
                        onClick={() => setShowAddWorklist(true)}
                        className={`${btnBase} justify-center border-transparent ${theme.buttonPrimary}`}>
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
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setSelectedWorklist(worklist)
                                            setShowDeleteWorklist(true)
                                        }}
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

            <EditProjectModal
                isOpen={showEditProject}
                isDark={isDark}
                onClose={() => setShowEditProject(false)}
                project={project}
                onSubmit={async (data) => {
                    try {
                        const payload = {
                            name: data.name,
                            type: data.type,
                            description: data.description,
                            status: data.status ?? 'upcoming'
                        }
                        await api.put(`/projects/${projectId}`, payload)
                        const res = await api.get(`/projects/${projectId}`)
                        const p = res.data.data
                        setProject(prev => prev ? {
                            ...prev,
                            name: p.name ?? prev.name,
                            type: p.type ?? prev.type,
                            description: p.description ?? prev.description,
                            status: p.status ?? prev.status,
                            memberList: mapMembers(p.members),
                            members: p.members ? p.members.length : prev.members,
                        } : prev)
                    } catch (err) { console.error('Failed to edit project', err) }
                }}
            />

            <ManageMembersModal
                isOpen={showManageMembers}
                isDark={isDark}
                onClose={() => setShowManageMembers(false)}
                members={project?.memberList ?? []}
                error={memberError}
                onAddMember={async (identifier, role) => {
                    try {
                        setMemberError('')
                        await api.post(`/projects/${projectId}/members`, { username: identifier, role })
                        await loadProject()
                    } catch (err: any) {
                        setMemberError(err.response?.data?.error || 'Failed to invite member')
                    }
                }}
                onRemoveMember={async (id) => {
                    try {
                        setMemberError('')
                        await api.delete(`/projects/${projectId}/members/${id}`)
                        await loadProject()
                    } catch (err: any) {
                        setMemberError(err.response?.data?.error || 'Failed to remove member')
                    }
                }}
            />

            <DeleteProjectModal
                isOpen={showDeleteProject}
                isDark={isDark}
                onClose={() => setShowDeleteProject(false)}
                projectName={project?.name ?? ''}
                onConfirm={async () => {
                    await api.delete(`/projects/${projectId}`)
                    navigate('/projects', { replace: true })
                }}
            />

            <AddWorklistModal
                isOpen={showAddWorklist}
                isDark={isDark}
                onClose={() => setShowAddWorklist(false)}
                onSubmit={async (data) => {
                    try {
                        await api.post(`/projects/${projectId}/worklists`, data)
                        const res = await api.get(`/projects/${projectId}/worklists`)
                        const wList = res.data.data || []
                        setWorklists(wList.map((w: unknown) => ({ ...(w as any), findings: (w as any).findings ? (w as any).findings.length : 0 })))
                    } catch (err) { console.error('Failed to add worklist', err) }
                }}
            />

            <DeleteWorklistModal
                isOpen={showDeleteWorklist}
                isDark={isDark}
                onClose={() => setShowDeleteWorklist(false)}
                worklistName={selectedWorklist?.name ?? ''}
                onConfirm={async () => {
                    if (!selectedWorklist) return
                    try {
                        await api.delete(`/projects/${projectId}/worklists/${selectedWorklist.id}`)
                        const res = await api.get(`/projects/${projectId}/worklists`)
                        const wList = res.data.data || []
                        setWorklists(wList.map((w: unknown) => ({ ...(w as any), findings: (w as any).findings ? (w as any).findings.length : 0 })))
                    } catch (err) { console.error('Failed to delete worklist', err) }
                }}
            />

        </div>
    )
}

export default Worklist
