import { useEffect, useState } from 'react'
import { User, Calendar, X, Pencil, Trash2, Plus } from 'lucide-react'
import { useOutletContext, useParams } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'
import api from '../api/axios'
import { getPageTheme } from '../utils/theme'

type ProjectData  = { id: string; name: string }
type WorklistData = { id: string; name: string; status: string }
type FindingData  = {
    id: string
    name: string
    code: string
    status: string
    severity: string
    confirmDate: string
    member: string
    cvssScore: number | null
    cvssVector: string
    impactedSystem: string
    executiveSummary: string
    stepsToReproduce: string
    remediationStrategy: string
}
type PoC = { id: string; type: 'screenshot' | 'request'; caption: string; content: string }

const btnBase  = 'flex items-center gap-2 px-2 md:px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-md md:rounded-lg border font-semibold text-xs xl:text-sm font-montserrat'
const iconSize = 'w-3 h-3 md:w-4 md:h-4'
const STATUSES = ['open', 'confirmed', 'fixing', 'fixed', 'closed on notes'] as const
const inputClass = (isDark: boolean) =>
    `w-full rounded-lg px-3 py-2 text-sm border font-montserrat focus:outline-none ${
        isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
               : 'bg-[#002C49]/5 border-[#002C49]/20 text-[#002C49] placeholder:text-[#002C49]/40'
    }`
const textareaClass = (isDark: boolean) => inputClass(isDark) + ' resize-none'
const monoClass    = (isDark: boolean) => inputClass(isDark).replace('font-montserrat', 'font-mono')

// CardModal 
function CardModal ({
    title, isDark, theme, onClose, children,
}: {
    title: string
    isDark: boolean
    theme: ReturnType<typeof getPageTheme>
    onClose: () => void
    children: React.ReactNode
}) {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />
            <div className={`relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-linear-to-br from-[#30536A]/90 to-[#133B55]/90 border border-[#27D6FF]/40' : 'bg-linear-to-br from-[#EBF4F6]/90 to-[#EEF1F3]/90 border border-[#27D6FF]/40'}`}>
                <div className='flex items-center justify-between mb-5'>
                    <h3 className={`text-lg font-semibold font-montserrat ${theme.text}`}>{title}</h3>
                    <button onClick={onClose} className={`rounded-lg p-1.5 hover:opacity-70 transition ${theme.text}`}>
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

// FindingDetail
function FindingDetail () {
    const { isDark, isCollapsed } = useOutletContext<LayoutContext>()
    const { projectId, worklistId, findingId } = useParams()
    const theme = getPageTheme(isDark)

    const [loading,    setLoading]    = useState(true)
    const [isEditing,  setIsEditing]  = useState(false)
    const [userRole,   setUserRole]   = useState<'pm' | 'dev' | 'pentester'>('pm')
    const [project,    setProject]    = useState<ProjectData | null>(null)
    const [worklist,   setWorklist]   = useState<WorklistData | null>(null)
    const [finding,    setFinding]    = useState<FindingData | null>(null)
    const [editData,   setEditData]   = useState<FindingData | null>(null)
    const [pocs,       setPocs]       = useState<PoC[]>([])
    const [openModal,  setOpenModal]  = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            api.get(`/projects/${projectId}`),
            api.get(`/projects/${projectId}/worklists/${worklistId}`),
            api.get(`/projects/${projectId}/findings/${findingId}`),
            api.get(`/projects/${projectId}/findings/${findingId}/evidence`),
            api.get('/auth/me'),
        ]).then(([projRes, wlRes, fRes, evRes, meRes]) => {
            setProject(projRes.data.data)
            setWorklist(wlRes.data.data)
            
            const raw = fRes.data.data
            setFinding({
                id: raw.id,
                name: raw.title,
                code: '—', // Backend does not have code for finding natively yet
                status: raw.status,
                severity: raw.severity,
                confirmDate: new Date(raw.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                member: 'Pentester',
                cvssScore: raw.cvss_score,
                cvssVector: raw.cvss_vector || '',
                impactedSystem: raw.impact || '',
                executiveSummary: raw.description || '',
                stepsToReproduce: raw.reproduction_steps || '',
                remediationStrategy: raw.remediation || '',
            })
            
            const evidences = evRes.data.data || []
            setPocs(evidences.map((ev: any) => ({
                id: ev.id,
                type: ev.mime_type?.startsWith('image/') ? 'screenshot' : 'request',
                caption: ev.file_name,
                content: `${api.defaults.baseURL}/projects/${projectId}/findings/${findingId}/evidence/${ev.id}/download`
            })))
            
            setUserRole(meRes.data.data?.projectRole ?? 'pm')
            setLoading(false)
        }).catch((err) => {
            console.error('Failed to load finding details:', err)
            setLoading(false)
        })
    }, [projectId, worklistId, findingId])

    const isPentester = userRole === 'pentester'
    const isDev       = userRole === 'dev'

    const currentFinding = isEditing ? editData : finding

    // ── helpers
    const severityClass = (sev: string) => {
        const s = sev.toLowerCase()
        if (s === 'critical') return isDark ? 'bg-[#EC2828] text-[#5B0000]'  : 'bg-[#5B0000] text-[#EC2828] font-semibold'
        if (s === 'high')     return isDark ? 'bg-[#E67219] text-[#5B3000]'  : 'bg-[#5B3100] text-[#E67219] font-semibold'
        if (s === 'medium')   return isDark ? 'bg-[#E6DF14] text-[#5B4100]'  : 'bg-[#5B4100] text-[#E6DF14] font-semibold'
        return                       isDark ? 'bg-[#17E58F] text-[#005B35]'  : 'bg-[#005B35] text-[#17E58F] font-semibold'
    }

    const statusBadgeClass = (s: string) => {
        if (isDark) {
            if (s === 'confirmed')       return 'bg-[#DCF3F8] text-[#1767AA]'
            if (s === 'fixing')          return 'bg-[#27D6FF] text-[#1767AA]'
            if (s === 'fixed')           return 'bg-[#DCF3F8] text-[#002C49]'
            if (s === 'closed on notes') return 'bg-[#27D6FF] text-[#00375C]'
            return 'text-[#27D6FF] border border-[#27D6FF]'
        }
        if (s === 'confirmed')       return 'bg-[#1767AA] text-[#F5F5F5]'
        if (s === 'fixing')          return 'bg-[#1767AA] text-[#27D6FF]'
        if (s === 'fixed')           return 'bg-[#002C49] text-[#DCF3F8]'
        if (s === 'closed on notes') return 'bg-[#00375C] text-[#22BBDE]'
        return 'text-[#1767AA] border border-[#1767AA]'
    }

    const capitalize = (s: string) =>
        s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    // ── grid col helper ─────────────────────────────────────────────────────────
    // "Sidebar extend: flex col 1" → 1 col when sidebar is extended, 2 col when collapsed

    // ── modal title map ─────────────────────────────────────────────────────────
    const modalTitle = (key: string) => {
        const map: Record<string, string> = {
            cvss: 'CVSS Score',
            impactedSystem: 'Impacted System',
            executiveSummary: 'Executive Summary',
            steps: 'Steps to Reproduce',
            remediation: 'Remediation Strategy',
        }
        if (map[key]) return map[key]
        return pocs.find(p => `poc-${p.id}` === key)?.caption ?? 'Detail'
    }

    const setEdit = (patch: Partial<FindingData>) =>
        setEditData(prev => prev ? { ...prev, ...patch } : prev)

    const setPocField = (id: string, patch: Partial<PoC>) =>
        setPocs(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))

    const handleSave = async () => {
        if (!editData) return
        try {
            await api.put(`/projects/${projectId}/findings/${findingId}`, {
                title: editData.name,
                status: editData.status,
                severity: editData.severity,
                cvss_score: editData.cvssScore,
                cvss_vector: editData.cvssVector,
                impact: editData.impactedSystem,
                description: editData.executiveSummary,
                reproduction_steps: editData.stepsToReproduce,
                remediation: editData.remediationStrategy
            })
            setFinding(editData)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update finding', error)
            alert('Failed to update finding details.')
        }
    }

    if (loading) {
        return <div className='text-center p-10 font-montserrat'>Loading Finding...</div>
    }
    if (!currentFinding) return null

    return (
        <div className='space-y-4 md:space-y-6 font-montserrat'>

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className='space-y-2'>
                <p className={`text-sm md:text-base font-medium ${theme.textMuted}`}>
                    {project?.name} &rsaquo; {worklist?.name}
                </p>

                <h1 className={`text-2xl md:text-3xl xl:text-4xl font-semibold ${theme.text}`}>
                    {currentFinding.name}
                </h1>

                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                    {/* badges + meta */}
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className={`rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${severityClass(currentFinding.severity)}`}>
                            {currentFinding.severity.charAt(0).toUpperCase() + currentFinding.severity.slice(1)}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${statusBadgeClass(currentFinding.status)}`}>
                            {capitalize(currentFinding.status)}
                        </span>
                        <span className={`text-xs md:text-sm font-medium ${theme.textMuted}`}>
                            {currentFinding.code}
                        </span>
                        <span className={`flex items-center gap-1 text-xs md:text-sm font-medium ${theme.textMuted}`}>
                            <Calendar size={12} /> {currentFinding.confirmDate}
                        </span>
                        <span className={`flex items-center gap-1 text-xs md:text-sm font-medium ${theme.textMuted}`}>
                            <User size={12} /> {currentFinding.member}
                        </span>
                    </div>

                    {/* action buttons */}
                    <div className='flex gap-2 shrink-0'>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className={`${btnBase} border-transparent ${theme.buttonPrimary}`}
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => { setEditData(null); setIsEditing(false) }}
                                    className={`${btnBase} ${theme.buttonOutline}`}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { setEditData({ ...finding! }); setIsEditing(true) }}
                                    className={`${btnBase} border-transparent ${theme.buttonPrimary}`}
                                >
                                    <Pencil className={iconSize} /> Edit
                                </button>
                                <button className={`${btnBase} ${theme.buttonDanger}`}>
                                    <Trash2 className={iconSize} /> Delete Finding
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/*  Finding Status  */}
            <div className={`flex flex-col gap-y-1 rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 space-y-3 ${theme.cardBase}`}>
                <div>
                    <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>Finding Status</p>
                    <p className={`text-sm lg:text-md font-medium ${theme.textMuted}`}>
                        {isPentester
                            ? 'Only project manager and developer can update status'
                            : 'Only developer and project manager can update'}
                    </p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    {STATUSES.map(s => {
                        const active    = currentFinding.status === s
                        const canChange = isEditing && !isPentester
                        return (
                            <button
                                key={s}
                                onClick={() => {
                                    if (canChange) {
                                        setEdit({ status: s })
                                        setLastUpdated(new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }))
                                    }
                                }}
                                disabled={!canChange}
                                className={`rounded-full px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-semibold transition ${
                                    active
                                        ? statusBadgeClass(s)
                                        : isDark
                                            ? 'text-white/40 border border-white/20'
                                            : 'text-[#002C49]/40 border border-[#002C49]/20'
                                } ${canChange && !active ? 'hover:opacity-80' : ''} ${!canChange ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {capitalize(s)}
                            </button>
                        )
                    })}
                </div>
                {lastUpdated && (
                    <p className={`text-sm lg:text-md ${theme.textMuted}`}>Last updated: {lastUpdated}</p>
                )}
            </div>

            {/* CVSS + Impacted System */}
            <div className={`flex flex-col gap-4 ${isCollapsed ? 'md:flex-row' : 'xl:flex-row'}`}>
                <button
                    onClick={() => setOpenModal('cvss')}
                    className={`flex-1 flex items-center gap-4 text-left rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 transition hover:scale-[1.01] ${theme.cardBase}`}
                >
                    <span className={`text-5xl md:text-6xl font-bold ${theme.text}`}>
                        {currentFinding.cvssScore ?? '—'}
                    </span>
                    <div className='flex flex-col gap-1'>
                        <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>CVSS Score</p>
                        <p className={`text-sm lg:text-base font-medium ${theme.textMuted}`}>
                            {currentFinding.cvssVector || '—'}
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => setOpenModal('impactedSystem')}
                    className={`flex-1 flex flex-col justify-center text-left rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 transition hover:scale-[1.01] ${theme.cardBase}`}
                >
                    <div className='flex flex-col gap-1'>
                        <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>Impacted System</p>
                        <p className={`text-sm lg:text-base font-medium ${theme.textMuted}`}>
                            {currentFinding.impactedSystem || '—'}
                        </p>
                    </div>
                </button>
            </div>

            {/* Executive Summary */}
            <button
                onClick={() => setOpenModal('executiveSummary')}
                className={`w-full text-left rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 transition hover:scale-[1.01] ${theme.cardBase}`}
            >
                <div className='flex flex-col gap-1'>
                    <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>Executive Summary</p>
                    <p className={`text-sm lg:text-base font-medium line-clamp-3 ${theme.textMuted}`}>
                        {currentFinding.executiveSummary || '—'}
                    </p>
                </div>
            </button>

            {/* Steps + Remediation */}
            <div className={`flex flex-col gap-4 ${isCollapsed ? 'md:flex-row' : 'xl:flex-row'}`}>
                <button
                    onClick={() => setOpenModal('steps')}
                    className={`flex-1 text-left rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 transition hover:scale-[1.01] ${theme.cardBase}`}
                >
                    <div className='flex flex-col gap-1'>
                        <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>Steps to Reproduce</p>
                        <p className={`text-sm lg:text-base font-medium line-clamp-4 whitespace-pre-line ${theme.textMuted}`}>
                            {currentFinding.stepsToReproduce || '—'}
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => setOpenModal('remediation')}
                    className={`flex-1 text-left rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 transition hover:scale-[1.01] ${theme.cardBase}`}
                >
                    <div className='flex flex-col gap-1'>
                        <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>Remediation Strategy</p>
                        <p className={`text-sm lg:text-base font-medium line-clamp-4 ${theme.textMuted}`}>
                            {currentFinding.remediationStrategy || '—'}
                        </p>
                    </div>
                </button>
            </div>

            {/* Proof of Concept */}
            <div className={`rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 space-y-5 ${theme.cardBase}`}>
                <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>Proof of Concept</p>

                {/* Screenshots */}
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <p className={`text-sm lg:text-md font-medium ${theme.textMuted}`}>Screenshots</p>
                        {isEditing && !isDev && (
                            <button
                                onClick={() => setPocs(prev => [...prev, { id: Date.now().toString(), type: 'screenshot', caption: `Screenshot ${prev.filter(p => p.type === 'screenshot').length + 1}`, content: '' }])}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${theme.buttonOutline}`}
                            >
                                <Plus size={12} /> Add
                            </button>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-3'>
                        {pocs.filter(p => p.type === 'screenshot').map(poc => (
                            <button
                                key={poc.id}
                                onClick={() => setOpenModal(`poc-${poc.id}`)}
                                className={`relative w-24 h-24 md:w-32 md:h-32 rounded-lg flex items-center justify-center text-xs font-medium transition hover:scale-[1.02] ${theme.cardBase}`}
                            >
                                {poc.content
                                    ? <img src={poc.content} alt={poc.caption} className='w-full h-full object-cover rounded-lg' />
                                    : <span className={`text-center px-1 ${theme.textMuted}`}>{poc.caption}</span>
                                }
                            </button>
                        ))}
                    </div>
                </div>

                {/* Requests & Responses */}
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <p className={`text-sm lg:text-md font-medium ${theme.textMuted}`}>Requests &amp; Responses</p>
                        {isEditing && !isDev && (
                            <button
                                onClick={() => setPocs(prev => [...prev, { id: Date.now().toString(), type: 'request', caption: 'New request', content: '' }])}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${theme.buttonOutline}`}
                            >
                                <Plus size={12} /> Add
                            </button>
                        )}
                    </div>
                    <div className='flex flex-col gap-3'>
                        {pocs.filter(p => p.type === 'request').map(poc => (
                            <button
                                key={poc.id}
                                onClick={() => setOpenModal(`poc-${poc.id}`)}
                                className={`text-left rounded-lg px-4 py-3 transition hover:scale-[1.005] ${theme.cardBase}`}
                            >
                                <p className={`text-xs font-semibold mb-1 ${theme.textMuted}`}>{poc.caption}</p>
                                <pre className={`text-xs font-mono line-clamp-3 whitespace-pre-wrap break-all ${theme.text}`}>{poc.content}</pre>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/*  Modals  */}
            {openModal && (
                <CardModal
                    isDark={isDark}
                    theme={theme}
                    title={modalTitle(openModal)}
                    onClose={() => setOpenModal(null)}
                >
                    {/* CVSS */}
                    {openModal === 'cvss' && (
                        <div className='space-y-4'>
                            <div>
                                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/60' : theme.textMuted}`}>CVSS Score (0–10)</label>
                                {isEditing && !isDev ? (
                                    <input type='number' min={0} max={10} step={0.1}
                                        value={editData?.cvssScore ?? ''}
                                        onChange={e => setEdit({ cvssScore: parseFloat(e.target.value) })}
                                        className={inputClass(isDark)}
                                    />
                                ) : (
                                    <p className={`text-5xl md:text-6xl font-bold ${theme.text}`}>{currentFinding.cvssScore ?? '—'}</p>
                                )}
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/60' : theme.textMuted}`}>CVSS Vector</label>
                                {isEditing && !isDev ? (
                                    <input type='text' maxLength={100}
                                        value={editData?.cvssVector ?? ''}
                                        onChange={e => setEdit({ cvssVector: e.target.value })}
                                        className={monoClass(isDark)}
                                    />
                                ) : (
                                    <p className={`font-mono text-sm lg:text-base font-medium break-all ${theme.text}`}>{currentFinding.cvssVector || '—'}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Impacted System */}
                    {openModal === 'impactedSystem' && (
                        <div>
                            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/60' : theme.textMuted}`}>Impacted System</label>
                            {isEditing && !isDev ? (
                                <input type='text' maxLength={200}
                                    value={editData?.impactedSystem ?? ''}
                                    onChange={e => setEdit({ impactedSystem: e.target.value })}
                                    className={inputClass(isDark)}
                                />
                            ) : (
                                <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>{currentFinding.impactedSystem || '—'}</p>
                            )}
                        </div>
                    )}

                    {/* Executive Summary */}
                    {openModal === 'executiveSummary' && (
                        <div>
                            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/60' : theme.textMuted}`}>Executive Summary</label>
                            {isEditing && !isDev ? (
                                <textarea maxLength={2000} rows={8}
                                    value={editData?.executiveSummary ?? ''}
                                    onChange={e => setEdit({ executiveSummary: e.target.value })}
                                    className={textareaClass(isDark)}
                                />
                            ) : (
                                <p className={`text-sm lg:text-base font-medium leading-relaxed ${theme.text}`}>{currentFinding.executiveSummary || '—'}</p>
                            )}
                        </div>
                    )}

                    {/* Steps to Reproduce */}
                    {openModal === 'steps' && (
                        <div>
                            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/60' : theme.textMuted}`}>Steps to Reproduce</label>
                            {isEditing && !isDev ? (
                                <textarea maxLength={3000} rows={10}
                                    value={editData?.stepsToReproduce ?? ''}
                                    onChange={e => setEdit({ stepsToReproduce: e.target.value })}
                                    className={textareaClass(isDark)}
                                />
                            ) : (
                                <p className={`text-sm lg:text-base font-medium leading-relaxed whitespace-pre-line ${theme.text}`}>{currentFinding.stepsToReproduce || '—'}</p>
                            )}
                        </div>
                    )}

                    {/* Remediation */}
                    {openModal === 'remediation' && (
                        <div>
                            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/60' : theme.textMuted}`}>Remediation Strategy</label>
                            {isEditing && !isDev ? (
                                <textarea maxLength={3000} rows={8}
                                    value={editData?.remediationStrategy ?? ''}
                                    onChange={e => setEdit({ remediationStrategy: e.target.value })}
                                    className={textareaClass(isDark)}
                                />
                            ) : (
                                <p className={`text-sm lg:text-base font-medium leading-relaxed ${theme.text}`}>{currentFinding.remediationStrategy || '—'}</p>
                            )}
                        </div>
                    )}

                    {/* PoC items */}
                    {openModal.startsWith('poc-') && (() => {
                        const poc = pocs.find(p => `poc-${p.id}` === openModal)
                        if (!poc) return null
                        const canEditPoc = isEditing && !isDev

                        return (
                            <div className='space-y-4'>
                                {/* Caption */}
                                <div>
                                    <label className={`block text-xs font-semibold mb-1 ${theme.textMuted}`}>Caption</label>
                                    {canEditPoc ? (
                                        <input type='text' maxLength={100}
                                            value={poc.caption}
                                            onChange={e => setPocField(poc.id, { caption: e.target.value })}
                                            className={inputClass(isDark)}
                                        />
                                    ) : (
                                        <p className={`text-sm font-semibold ${theme.text}`}>{poc.caption}</p>
                                    )}
                                </div>

                                {poc.type === 'screenshot' ? (
                                    <div className={`w-full h-48 rounded-lg flex items-center justify-center ${theme.cardBase}`}>
                                        {poc.content
                                            ? <img src={poc.content} alt={poc.caption} className='max-h-full rounded-lg' />
                                            : <span className={`text-sm ${theme.textMuted}`}>No image uploaded</span>
                                        }
                                    </div>
                                ) : (
                                    <div>
                                        <label className={`block text-xs font-semibold mb-1 ${theme.textMuted}`}>Content</label>
                                        {canEditPoc ? (
                                            <textarea maxLength={5000} rows={10}
                                                value={poc.content}
                                                onChange={e => setPocField(poc.id, { content: e.target.value })}
                                                className={monoClass(isDark)}
                                            />
                                        ) : (
                                            <pre className={`text-xs font-mono whitespace-pre-wrap break-all rounded-lg p-3 ${
                                                isDark ? 'bg-white/10' : 'bg-[#002C49]/5'
                                            } ${theme.text}`}>
                                                {poc.content}
                                            </pre>
                                        )}
                                    </div>
                                )}

                                {/* Delete PoC (edit mode only) */}
                                {canEditPoc && (
                                    <button
                                        onClick={() => { setPocs(prev => prev.filter(p => p.id !== poc.id)); setOpenModal(null) }}
                                        className={`${btnBase} ${theme.buttonDanger} mt-2`}
                                    >
                                        <Trash2 className={iconSize} /> Remove
                                    </button>
                                )}
                            </div>
                        )
                    })()}
                </CardModal>
            )}
        </div>
    )
}

export default FindingDetail
