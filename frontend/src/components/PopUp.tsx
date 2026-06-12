import { useState, useEffect, useRef } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import {
    X,
    // Trash2,
    // Users,
    // Pencil,
    // FilePlusCorner,
    Plus,
    Upload,
    ChevronDown,
    Calculator,
    AlertTriangle,
} from 'lucide-react'

type BaseModalProps = {
    isOpen: boolean
    isDark: boolean
    onClose: () => void
}


function PopUpBase({
    isOpen,
    isDark,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
}: BaseModalProps & { title: string; children: React.ReactNode; maxWidth?: string }) {
    if (!isOpen) return null

    const overlay = isDark ? 'bg-black/60' : 'bg-[#002C49]/40'
    const panel = isDark
        ? 'bg-gradient-to-br from-[#294B63] via-[#173B56] to-[#0B2E46] border border-[#2BA7D6]/40 text-[#F5F5F5]'
        : 'bg-white border border-[#27D6FF]/40 text-[#002C49]'

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlay}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className={`relative w-full ${maxWidth} rounded-2xl border shadow-2xl ${panel}`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-[#2BA7D6]/30' : 'border-[#27D6FF]/30'}`}>
                    <h2 className="text-lg font-semibold font-montserrat">{title}</h2>
                    <button
                        onClick={onClose}
                        className={`rounded-lg p-1.5 transition ${isDark ? 'hover:bg-[#2BA7D6]/20 text-[#41B0EC] hover:text-[#d81c1c]' : 'hover:bg-[#27D6FF]/20 text-[#1767AA] hover:text-[#d81c1c]'}`}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

// ─── Shared Input / Label helpers ──────────────────────────────────────────────

function Label({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
    return (
        <label className={`block text-sm font-semibold font-montserrat mb-1 ${isDark ? 'text-[#41B0EC]' : 'text-[#1767AA]'}`}>
            {children}
        </label>
    )
}

function Input({
    isDark,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { isDark: boolean }) {
    return (
        <input
            {...props}
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-montserrat border focus:outline-none focus:ring-2 ${
                isDark
                    ? 'bg-[#1767AA]/20 border-[#2BA7D6]/50 text-white placeholder:text-[#41B0EC]/50 focus:ring-[#2BA7D6]'
                    : 'bg-[#F5F5F5] border-[#1767AA]/30 text-[#002C49] placeholder:text-[#1767AA]/40 focus:ring-[#20A6DA]'
            }`}
        />
    )
}

function Textarea({
    isDark,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { isDark: boolean }) {
    return (
        <textarea
            {...props}
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-montserrat border focus:outline-none focus:ring-2 resize-none ${
                isDark
                    ? 'bg-[#1767AA]/20 border-[#2BA7D6]/50 text-white placeholder:text-[#41B0EC]/50 focus:ring-[#2BA7D6]'
                    : 'bg-[#F5F5F5] border-[#1767AA]/30 text-[#002C49] placeholder:text-[#1767AA]/40 focus:ring-[#20A6DA]'
            }`}
        />
    )
}

function Select({
    isDark,
    children,
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { isDark: boolean; children: React.ReactNode }) {
    return (
        <div className="relative">
            <select
                {...props}
                className={`appearance-none w-full rounded-xl px-4 py-2.5 pr-10 text-sm font-montserrat border focus:outline-none focus:ring-2 ${
                    isDark
                        ? 'bg-[#1767AA]/20 border-[#2BA7D6]/50 text-white focus:ring-[#2BA7D6]'
                        : 'bg-[#F5F5F5] border-[#1767AA]/30 text-[#002C49] focus:ring-[#20A6DA]'
                }`}
            >
                {children}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
        </div>
    )
}

function ModalFooter({
    isDark,
    onClose,
    onConfirm,
    confirmLabel,
    confirmClass,
}: {
    isDark: boolean
    onClose: () => void
    onConfirm: () => void
    confirmLabel: string
    confirmClass?: string
}) {
    const cancelClass = isDark
        ? 'border border-[#2BA7D6]/40 text-[#41B0EC] hover:bg-[#2BA7D6]/20 hover:text-[#EC2828]'
        : 'border border-[#1767AA]/30 text-[#1767AA] hover:bg-[#27D6FF]/10 hover:text-[#EC2828]'

    const defaultConfirm = isDark
        ? 'bg-[#41B0EC] text-white hover:bg-[#27D6FF]'
        : 'bg-[#1767AA] text-white hover:bg-[#41B0EC]'

    return (
        <div className={`flex justify-end gap-3 pt-2 border-t ${isDark ? 'border-[#2BA7D6]/30' : 'border-[#27D6FF]/30'}`}>
            <button
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-sm font-semibold font-montserrat transition ${cancelClass}`}
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl text-sm font-semibold font-montserrat transition ${confirmClass ?? defaultConfirm}`}
            >
                {confirmLabel}
            </button>
        </div>
    )
}


{/* NEW PROJECT MODAL */}
type NewProjectModalProps = BaseModalProps & {
    onSubmit: (data: {
        name: string
        type: string
        status: string
        description: string
    }) => void
}

export function NewProjectModal({ isOpen, isDark, onClose, onSubmit }: NewProjectModalProps) {
    const [form, setForm] = useState({ name: '', type: '', status: 'upcoming', description: '' })

    const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

    const handleSubmit = () => {
        if (!form.name.trim()) return
        onSubmit(form)
        setForm({ name: '', type: '', status: 'upcoming', description: '' })
        onClose()
    }

    return (
        <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="New Project">
            <div>
                <Label isDark={isDark}>Project Name <span className="text-red-400">*</span></Label>
                <Input isDark={isDark} placeholder="e.g. mycompany.com" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>

            <div>
                <Label isDark={isDark}>Type <span className="text-red-400">*</span></Label>
                <Input isDark={isDark} placeholder='e.g. Web Application, API Security...' value={form.type} onChange={(e) => set('type', e.target.value)} />
            </div>

            <div>
                <Label isDark={isDark}>Description</Label>
                <Textarea
                    isDark={isDark}
                    rows={3}
                    placeholder="Describe the scope and objectives of this engagement..."
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                />
            </div>

            <ModalFooter isDark={isDark} onClose={onClose} onConfirm={handleSubmit} confirmLabel="Create Project" />
        </PopUpBase>
    )
}


{/* EDIT PROJECT MODAL */}
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

type EditProjectModalProps = BaseModalProps & {
    project: ProjectData | null
    onSubmit: (data: Partial<ProjectData>) => void
}

export function EditProjectModal({ isOpen, isDark, onClose, project, onSubmit }: EditProjectModalProps) {
    const [form, setForm] = useState({
        name: project?.name ?? '',
        type: project?.type ?? '',
        status: project?.status ?? 'upcoming',
        description: project?.description ?? '',
    })

    // Sync when project changes
    useEffect(() => {
        if (project) setForm({
            name: project.name ?? '',
            type: project.type ?? '',
            status: project.status ?? 'upcoming',
            description: project.description ?? '',
        })
    }, [project])

    const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

    const handleSubmit = () => {
        if (!form.name.trim()) return
        onSubmit(form)
        onClose()
    }

    const optClass = isDark ? 'bg-[#0B2E46] text-white' : 'bg-white text-[#002C49]'

    return (
        <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="Edit Project">
            <div>
                <Label isDark={isDark}>Project Name <span className="text-red-400">*</span></Label>
                <Input isDark={isDark} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label isDark={isDark}>Type <span className="text-red-400">*</span></Label>
                    <Input isDark={isDark} placeholder='e.g. Web Application, API Security...' value={form.type} onChange={(e) => set('type', e.target.value)} />
                </div>

                <div>
                    <Label isDark={isDark}>Status</Label>
                    <Select isDark={isDark} value={form.status} onChange={(e) => set('status', e.target.value)}>
                        <option className={optClass} value="upcoming">Upcoming</option>
                        <option className={optClass} value="active">Active</option>
                        <option className={optClass} value="paused">Paused</option>
                        <option className={optClass} value="completed">Completed</option>
                    </Select>
                </div>
            </div>

            <div>
                <Label isDark={isDark}>Description</Label>
                <Textarea isDark={isDark} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>

            <ModalFooter isDark={isDark} onClose={onClose} onConfirm={handleSubmit} confirmLabel="Save Changes" />
        </PopUpBase>
    )
}


{/* MANAGE MEMBERS MODAL */}
type Member = { id: string; name: string; username: string; role: string }

type ManageMembersModalProps = BaseModalProps & {
    members: Member[]
    onAddMember: (username: string, role: string) => void
    onRemoveMember: (id: string) => void
    isSubmitting?: boolean
    addError?: string
}

export function ManageMembersModal({ isOpen, isDark, onClose, members, onAddMember, onRemoveMember, isSubmitting, addError }: ManageMembersModalProps) {
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('pentester')

    const handleAdd = () => {
        if (!username.trim()) return
        onAddMember(username, role)
        setUsername('')
    }

    const optClass = isDark ? 'bg-[#0B2E46] text-white' : 'bg-white text-[#002C49]'
    const rowClass = isDark ? 'border-[#2BA7D6]/20' : 'border-[#27D6FF]/30'

    return (
        <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="Manage Members" maxWidth="max-w-xl">
            {/* Add member */}
            <div>
                <Label isDark={isDark}>Invite Member</Label>
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 min-w-0">
                        <Input isDark={isDark} placeholder="Username..." value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className='flex gap-2'>
                        <div className="w-40 shrink-0">
                        <Select isDark={isDark} value={role} onChange={(e) => setRole(e.target.value)}>
                            <option className={optClass} value="pm">Project Manager</option>
                            <option className={optClass} value="pentester">Pentester</option>
                            <option className={optClass} value="dev">Developer</option>
                        </Select>
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={isSubmitting}
                            className={`shrink-0 flex items-center px-3 py-2 rounded-xl text-sm font-semibold font-montserrat transition disabled:opacity-50 ${
                                isDark ? 'bg-[#41B0EC] text-white hover:bg-[#27D6FF]' : 'bg-[#1767AA] text-white hover:bg-[#41B0EC]'
                            }`}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
                {addError && <p className="text-xs text-red-400 font-montserrat mt-1">{addError}</p>}
            </div>

            {/* Member list */}
            <div className="space-y-1 mt-2">
                <Label isDark={isDark}>Current Members ({members.length})</Label>
                {members.length === 0 && (
                    <p className="text-sm opacity-50 font-montserrat py-2">No members yet.</p>
                )}
                {members.map((m) => (
                    <div key={m.id} className={`flex items-center justify-between py-2.5 border-b ${rowClass}`}>
                        <div>
                            <p className="text-sm font-semibold font-montserrat">{m.name}</p>
                            <p className={`text-xs font-montserrat opacity-60`}>@{m.username}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-semibold font-montserrat px-2 py-0.5 rounded-full ${
                                isDark ? 'bg-[#2BA7D6]/20 text-[#41B0EC]' : 'bg-[#27D6FF]/20 text-[#1767AA]'
                            }`}>{m.role}</span>
                            <button
                                onClick={() => onRemoveMember(m.id)}
                                className="text-red-400 hover:text-red-500 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`flex justify-end pt-2 border-t ${isDark ? 'border-[#2BA7D6]/30' : 'border-[#27D6FF]/30'}`}>
                <button
                    onClick={onClose}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold font-montserrat transition ${
                        isDark ? 'bg-[#41B0EC] text-white hover:bg-[#27D6FF]' : 'bg-[#1767AA] text-white hover:bg-[#41B0EC]'
                    }`}
                >
                    Done
                </button>
            </div>
        </PopUpBase>
    )
}


{/* DELETE PROJECT MODAL */}
type DeleteProjectModalProps = BaseModalProps & {
    projectName: string
    onConfirm: () => Promise<void>
}

export function DeleteProjectModal({ isOpen, isDark, onClose, projectName, onConfirm }: DeleteProjectModalProps) {
    const [loading, setLoading] = useState(false)
    const handleConfirm = async () => {
        setLoading(true)
        try { await onConfirm() } finally { setLoading(false) }
    }

    return (
        <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="Delete Project" maxWidth="max-w-md">
            <div className="flex flex-col items-center text-center gap-3 py-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10">
                    <AlertTriangle size={28} className="text-red-400" />
                </div>
                <p className="text-base font-montserrat">
                    Are you sure you want to delete{' '}
                    <span className="font-bold">{projectName}</span>?
                </p>
                <p className="text-sm opacity-60 font-montserrat">
                    This will permanently remove the project, all worklists, and all findings. This action cannot be undone.
                </p>
            </div>

            <ModalFooter
                isDark={isDark}
                onClose={onClose}
                onConfirm={handleConfirm}
                confirmLabel={loading ? 'Deleting...' : 'Delete Project'}
                confirmClass={`bg-red-500 text-white hover:bg-red-600 ${loading ? 'opacity-60 pointer-events-none' : ''}`}
            />
        </PopUpBase>
    )
}


{/* ADD WORKLIST MODAL */}
type WorklistData = { id: string; name: string; code: string; status: string }

type AddWorklistModalProps = BaseModalProps & {
    onSubmit: (data: Omit<WorklistData, 'id' | 'findings'>) => void
}

export function AddWorklistModal({ isOpen, isDark, onClose, onSubmit }: AddWorklistModalProps) {
    const [form, setForm] = useState({ name: '', code: '', status: 'not started' })
    const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

    const handleSubmit = () => {
        if (!form.name.trim()) return
        onSubmit(form)
        setForm({ name: '', code: '', status: 'not started' })
        onClose()
    }

    const optClass = isDark ? 'bg-[#0B2E46] text-white' : 'bg-white text-[#002C49]'

    return (
        <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="Add Worklist">
            <div>
                <Label isDark={isDark}>Worklist Name <span className="text-red-400">*</span></Label>
                <Input isDark={isDark} placeholder="e.g. Login Page" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>

            <div>
                <Label isDark={isDark}>WSTG Code</Label>
                <Input isDark={isDark} placeholder="e.g. WSTG-ATHN, WSTG-SESS" value={form.code} onChange={(e) => set('code', e.target.value)} />
                <p className={`mt-1 text-xs font-montserrat opacity-50`}>Separate multiple codes with commas.</p>
            </div>

            <div>
                <Label isDark={isDark}>Status</Label>
                <Select isDark={isDark} value={form.status} onChange={(e) => set('status', e.target.value)}>
                    <option className={optClass} value="not started">Not Started</option>
                    <option className={optClass} value="in progress">In Progress</option>
                    <option className={optClass} value="completed">Completed</option>
                </Select>
            </div>

            <ModalFooter isDark={isDark} onClose={onClose} onConfirm={handleSubmit} confirmLabel="Add Worklist" />
        </PopUpBase>
    )
}


{/* EDIT WORKLIST MODAL */}
type EditWorklistModalProps = BaseModalProps & {
    worklist: WorklistData | null
    onSubmit: (data: Partial<WorklistData>) => void
}

export function EditWorklistModal({ isOpen, isDark, onClose, worklist, onSubmit }: EditWorklistModalProps) {
    const [form, setForm] = useState({
        name: worklist?.name ?? '',
        code: worklist?.code ?? '',
        status: worklist?.status ?? 'Not Started',
    })

    const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

    const handleSubmit = () => {
        if (!form.name.trim()) return
        onSubmit(form)
        onClose()
    }

    const optClass = isDark ? 'bg-[#0B2E46] text-white' : 'bg-white text-[#002C49]'

    return (
        <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="Edit Worklist">
            <div>
                <Label isDark={isDark}>Worklist Name <span className="text-red-400">*</span></Label>
                <Input isDark={isDark} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>

            <div>
                <Label isDark={isDark}>WSTG Code</Label>
                <Input isDark={isDark} value={form.code} onChange={(e) => set('code', e.target.value)} />
            </div>

            <div>
                <Label isDark={isDark}>Status</Label>
                <Select isDark={isDark} value={form.status} onChange={(e) => set('status', e.target.value)}>
                    <option className={optClass} value="Not Started">Not Started</option>
                    <option className={optClass} value="In Progress">In Progress</option>
                    <option className={optClass} value="Completed">Completed</option>
                </Select>
            </div>

            <ModalFooter isDark={isDark} onClose={onClose} onConfirm={handleSubmit} confirmLabel="Save Changes" />
        </PopUpBase>
    )
}


{/* DELETE WORKLIST MODAL */}
type DeleteWorklistModalProps = BaseModalProps & {
    worklistName: string
    onConfirm: () => Promise<void>
}

export function DeleteWorklistModal({ isOpen, isDark, onClose, worklistName, onConfirm }: DeleteWorklistModalProps) {
    const [loading, setLoading] = useState(false)
    const handleConfirm = async () => {
        setLoading(true)
        try { await onConfirm() } finally { setLoading(false) }
    }

    return (
        <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="Delete Worklist" maxWidth="max-w-md">
            <div className="flex flex-col items-center text-center gap-3 py-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10">
                    <AlertTriangle size={28} className="text-red-400" />
                </div>
                <p className="text-base font-montserrat">
                    Delete <span className="font-bold">{worklistName}</span>?
                </p>
                <p className="text-sm opacity-60 font-montserrat">
                    All findings inside this worklist will also be deleted permanently.
                </p>
            </div>

            <ModalFooter
                isDark={isDark}
                onClose={onClose}
                onConfirm={handleConfirm}
                confirmLabel={loading ? 'Deleting...' : 'Delete Worklist'}
                confirmClass={`bg-red-500 text-white hover:bg-red-600 ${loading ? 'opacity-60 pointer-events-none' : ''}`}
            />
        </PopUpBase>
    )
}


{/* CVSS CALCULATOR */}
type CvssMetrics = {
    AV: string; AC: string; PR: string; UI: string
    S: string; C: string; I: string; A: string
}

const CVSS_OPTIONS: Record<keyof CvssMetrics, { label: string; options: { val: string; label: string; score: number }[] }> = {
    AV: { label: 'Attack Vector', options: [{ val: 'N', label: 'Network', score: 0.85 }, { val: 'A', label: 'Adjacent', score: 0.62 }, { val: 'L', label: 'Local', score: 0.55 }, { val: 'P', label: 'Physical', score: 0.2 }] },
    AC: { label: 'Attack Complexity', options: [{ val: 'L', label: 'Low', score: 0.77 }, { val: 'H', label: 'High', score: 0.44 }] },
    PR: { label: 'Privileges Required', options: [{ val: 'N', label: 'None', score: 0.85 }, { val: 'L', label: 'Low', score: 0.62 }, { val: 'H', label: 'High', score: 0.27 }] },
    UI: { label: 'User Interaction', options: [{ val: 'N', label: 'None', score: 0.85 }, { val: 'R', label: 'Required', score: 0.62 }] },
    S:  { label: 'Scope', options: [{ val: 'U', label: 'Unchanged', score: 0 }, { val: 'C', label: 'Changed', score: 1 }] },
    C:  { label: 'Confidentiality', options: [{ val: 'N', label: 'None', score: 0 }, { val: 'L', label: 'Low', score: 0.22 }, { val: 'H', label: 'High', score: 0.56 }] },
    I:  { label: 'Integrity', options: [{ val: 'N', label: 'None', score: 0 }, { val: 'L', label: 'Low', score: 0.22 }, { val: 'H', label: 'High', score: 0.56 }] },
    A:  { label: 'Availability', options: [{ val: 'N', label: 'None', score: 0 }, { val: 'L', label: 'Low', score: 0.22 }, { val: 'H', label: 'High', score: 0.56 }] },
}

function calcCVSS(m: CvssMetrics): number {
    const get = (key: keyof CvssMetrics) =>
        CVSS_OPTIONS[key].options.find((o) => o.val === m[key])?.score ?? 0

    const AV = get('AV'), AC = get('AC'), UI = get('UI')
    const S = m.S === 'C', C = get('C'), I = get('I'), A = get('A')
    
    let PR = get('PR')
    if (S) {
        if (m.PR === 'L') PR = 0.68
        if (m.PR === 'H') PR = 0.50
    }

    const ISCBase = 1 - (1 - C) * (1 - I) * (1 - A)
    const ISS = S ? 7.52 * (ISCBase - 0.029) - 3.25 * Math.pow(ISCBase - 0.02, 15) : 6.42 * ISCBase
    const ESS = 8.22 * AV * AC * PR * UI
    if (ISS <= 0) return 0

    const raw = S ? Math.min(1.08 * (ISS + ESS), 10) : Math.min(ISS + ESS, 10)
    return Math.ceil(raw * 10) / 10
}

function cvssRating(score: number): { label: string; color: string } {
    if (score === 0) return { label: 'None', color: 'text-gray-400' }
    if (score < 4) return { label: 'Low', color: 'text-green-400' }
    if (score < 7) return { label: 'Medium', color: 'text-yellow-400' }
    if (score < 9) return { label: 'High', color: 'text-orange-400' }
    return { label: 'Critical', color: 'text-red-400' }
}

type CvssCalculatorModalProps = BaseModalProps & {
    onApply: (score: number, vector: string) => void
}

export function CvssCalculatorModal({ isOpen, isDark, onClose, onApply }: CvssCalculatorModalProps) {
    const [m, setM] = useState<CvssMetrics>({ AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'N', I: 'N', A: 'N' })

    const score = calcCVSS(m)
    const { label, color } = cvssRating(score)
    const vector = `CVSS:3.1/AV:${m.AV}/AC:${m.AC}/PR:${m.PR}/UI:${m.UI}/S:${m.S}/C:${m.C}/I:${m.I}/A:${m.A}`

    const btnBase = (selected: boolean) =>
        `px-3 py-1.5 rounded-lg text-xs font-semibold font-montserrat border transition ${
            selected
                ? isDark ? 'bg-[#41B0EC] border-[#41B0EC] text-white' : 'bg-[#1767AA] border-[#1767AA] text-white'
                : isDark ? 'border-[#2BA7D6]/40 text-[#41B0EC] hover:bg-[#2BA7D6]/20' : 'border-[#1767AA]/30 text-[#1767AA] hover:bg-[#27D6FF]/20'
        }`

    const getVal = (v: string, map: Record<string, number>) => map[v] ?? 0
    const chartData = [
        { metric: 'AV', full: 'Attack Vector', value: getVal(m.AV, { P: 0, L: 33, A: 66, N: 100 }) },
        { metric: 'AC', full: 'Attack Complexity', value: getVal(m.AC, { L: 0, H: 100 }) },
        { metric: 'PR', full: 'Privileges Required', value: getVal(m.PR, { N: 0, L: 50, H: 100 }) },
        { metric: 'UI', full: 'User Interaction', value: getVal(m.UI, { N: 0, R: 100 }) },
        { metric: 'S', full: 'Scope', value: getVal(m.S, { U: 0, C: 100 }) },
        { metric: 'C', full: 'Confidentiality', value: getVal(m.C, { N: 0, L: 50, H: 100 }) },
        { metric: 'I', full: 'Integrity', value: getVal(m.I, { N: 0, L: 50, H: 100 }) },
        { metric: 'A', full: 'Availability', value: getVal(m.A, { N: 0, L: 50, H: 100 }) },
    ]

    return (
        <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="CVSS v3.1 Calculator" maxWidth="max-w-2xl">
            {/* Score display */}
            <div className={`flex flex-col sm:flex-row items-center gap-6 rounded-xl px-5 py-4 ${isDark ? 'bg-[#0B2E46]' : 'bg-[#F0FAFF]'}`}>
                <div className="flex-1 w-full text-center sm:text-left">
                    <p className="text-xs font-semibold font-montserrat opacity-60 uppercase tracking-wider">Base Score</p>
                    <p className={`text-5xl font-bold font-montserrat ${color}`}>{score.toFixed(1)}</p>
                    <p className={`text-sm font-semibold font-montserrat ${color}`}>{label}</p>
                    <div className="mt-4">
                        <p className="text-xs opacity-60 font-montserrat mb-1">Vector String</p>
                        <p className={`text-xs font-mono break-all max-w-xs mx-auto sm:mx-0 ${isDark ? 'text-[#41B0EC]' : 'text-[#1767AA]'}`}>{vector}</p>
                    </div>
                </div>
                <div className="w-full sm:w-64 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                            <PolarGrid stroke={isDark ? '#2BA7D640' : '#1767AA40'} />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: isDark ? '#41B0EC' : '#1767AA', fontSize: 10, fontWeight: 600, fontFamily: 'Montserrat' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: isDark ? '#002C49' : '#FFFFFF', borderColor: isDark ? '#41B0EC' : '#1767AA', borderRadius: '8px' }}
                                itemStyle={{ color: isDark ? '#F5F5F5' : '#002C49', fontWeight: 600, fontFamily: 'Montserrat', fontSize: 12 }}
                                formatter={(val, _name, props) => [`Score: ${val}%`, props.payload.full]}
                            />
                            <Radar name="CVSS Metric" dataKey="value" stroke={isDark ? '#41B0EC' : '#1767AA'} fill={isDark ? '#41B0EC' : '#1767AA'} fillOpacity={0.4} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(CVSS_OPTIONS) as (keyof CvssMetrics)[]).map((key) => (
                    <div key={key}>
                        <Label isDark={isDark}>{CVSS_OPTIONS[key].label}</Label>
                        <div className="flex flex-wrap gap-2">
                            {CVSS_OPTIONS[key].options.map((opt) => (
                                <button
                                    key={opt.val}
                                    onClick={() => setM((p) => ({ ...p, [key]: opt.val }))}
                                    className={btnBase(m[key] === opt.val)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <ModalFooter
                isDark={isDark}
                onClose={onClose}
                onConfirm={() => { onApply(score, vector); onClose() }}
                confirmLabel={`Apply Score (${score.toFixed(1)})`}
            />
        </PopUpBase>
    )
}


{/* ADD FINDING MODAL */}
type FindingFormData = {
    vulnName: string
    executiveSummary: string
    vulnType: string
    wstgCode: string
    impactedSystem: string
    cvssScore: number
    cvssVector: string
    str: string
    remediation: string
    pocText: string
    pocFiles: File[]
    contributorName: string
}

type AddFindingModalProps = BaseModalProps & {
    members: { id: string; name: string }[]
    onSubmit: (data: FindingFormData) => void
}

export function AddFindingModal({ isOpen, isDark, onClose, members, onSubmit }: AddFindingModalProps) {
    const [form, setForm] = useState<FindingFormData>({
        vulnName: '', executiveSummary: '', vulnType: '', wstgCode: '', impactedSystem: '',
        cvssScore: 0, cvssVector: '', str: '', remediation: '',
        pocText: '', pocFiles: [], contributorName: '',
    })

    const fileRef = useRef<HTMLInputElement>(null)

    const set = (key: keyof FindingFormData, val: unknown) => setForm((p) => ({ ...p, [key]: val }))

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) set('pocFiles', [...form.pocFiles, ...Array.from(e.target.files)])
    }

    const removeFile = (i: number) => set('pocFiles', form.pocFiles.filter((_, idx) => idx !== i))

    const handleSubmit = () => {
        if (!form.vulnName.trim()) return
        onSubmit(form)
        onClose()
    }

    const optClass = isDark ? 'bg-[#0B2E46] text-white' : 'bg-white text-[#002C49]'
    const { label: cvssLabel, color: cvssColor } = cvssRating(form.cvssScore)

    return (
        <>
            <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="Add Finding" maxWidth="max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Vulnerability Name <span className="text-red-400">*</span></Label>
                        <Input isDark={isDark} placeholder="e.g. SQL Injection in login form" value={form.vulnName} onChange={(e) => set('vulnName', e.target.value)} />
                    </div>

                    <div>
                        <Label isDark={isDark}>Vulnerability Type <span className="text-red-400">*</span></Label>
                        <Input isDark={isDark} placeholder='e.g. Broken Authentication, XSS, IDOR...' value={form.vulnType} onChange={(e) => set('vulnType', e.target.value)} />
                    </div>

                    <div>
                        <Label isDark={isDark}>WSTG Code</Label>
                        <Input isDark={isDark} placeholder='e.g. WSTG-ATHN-01' value={form.wstgCode} onChange={(e) => set('wstgCode', e.target.value)} />
                    </div>

                    <div>
                        <Label isDark={isDark}>Impacted System <span className="text-red-400">*</span></Label>
                        <Input isDark={isDark} placeholder="e.g. /api/v1/login" value={form.impactedSystem} onChange={(e) => set('impactedSystem', e.target.value)} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Executive Summary</Label>
                        <Textarea isDark={isDark} rows={3} placeholder="Brief description of the vulnerability and its impact..." value={form.executiveSummary} onChange={(e) => set('executiveSummary', e.target.value)} />
                    </div>

                    {/* CVSS */}
                    <div>
                        <Label isDark={isDark}>CVSS Score <span className="opacity-50 font-normal">(0–10)</span></Label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number" min={0} max={10} step={0.1}
                                value={form.cvssScore || ''}
                                onChange={e => set('cvssScore', parseFloat(e.target.value) || 0)}
                                placeholder="0.0"
                                className={`w-24 rounded-xl px-3 py-2.5 border text-sm font-montserrat font-bold focus:outline-none ${
                                    isDark ? 'bg-[#0B2E46] border-[#2BA7D6]/50 text-white placeholder:text-white/30' : 'bg-white border-[#1767AA]/30 text-[#002C49] placeholder:text-[#002C49]/30'
                                } ${form.cvssScore > 0 ? cvssColor : ''}`}
                            />
                            {form.cvssScore > 0 && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cvssColor} ${isDark ? 'bg-white/10' : 'bg-[#002C49]/5'}`}>
                                    {cvssLabel}
                                </span>
                            )}
                            <button
                                onClick={() => window.open('/cvss', '_blank')}
                                className={`ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-montserrat border transition ${
                                    isDark ? 'border-[#41B0EC] text-[#41B0EC] hover:bg-[#2BA7D6]/20' : 'border-[#1767AA] text-[#1767AA] hover:bg-[#27D6FF]/20'
                                }`}
                            >
                                <Calculator size={16} /> Calculate
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label isDark={isDark}>CVSS Vector</Label>
                        <Input isDark={isDark} placeholder="CVSS:4.0/AV:N/AC:L/..." value={form.cvssVector} onChange={e => set('cvssVector', e.target.value)} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Steps to Reproduce (STR)</Label>
                        <Textarea isDark={isDark} rows={4} placeholder="1. Navigate to...\n2. Enter payload...\n3. Observe..." value={form.str} onChange={(e) => set('str', e.target.value)} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Remediation</Label>
                        <Textarea isDark={isDark} rows={3} placeholder="Describe how to fix this vulnerability..." value={form.remediation} onChange={(e) => set('remediation', e.target.value)} />
                    </div>

                    {/* PoC */}
                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Proof of Concept (PoC)</Label>
                        <Textarea isDark={isDark} rows={3} placeholder="Paste payload, curl command, or describe PoC..." value={form.pocText} onChange={(e) => set('pocText', e.target.value)} />
                        
                        {/* File upload */}
                        <div
                            onClick={() => fileRef.current?.click()}
                            className={`mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 cursor-pointer transition ${
                                isDark ? 'border-[#2BA7D6]/40 hover:border-[#41B0EC] hover:bg-[#2BA7D6]/10' : 'border-[#1767AA]/30 hover:border-[#1767AA] hover:bg-[#27D6FF]/10'
                            }`}
                        >
                            <Upload size={20} className={isDark ? 'text-[#41B0EC]' : 'text-[#1767AA]'} />
                            <p className="text-xs font-montserrat opacity-60">Click to attach screenshots or files</p>
                        </div>
                        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />

                        {form.pocFiles.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {form.pocFiles.map((f, i) => (
                                    <div key={i} className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-montserrat ${isDark ? 'bg-[#0B2E46]' : 'bg-[#EAF6FF]'}`}>
                                        <span className="truncate max-w-xs">{f.name}</span>
                                        <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-500 ml-2"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contributor */}
                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Contributor</Label>
                        <Select isDark={isDark} value={form.contributorName} onChange={(e) => set('contributorName', e.target.value)}>
                            <option className={optClass} value="">Select contributor...</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.name} className={optClass}>{m.name}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                <ModalFooter isDark={isDark} onClose={onClose} onConfirm={handleSubmit} confirmLabel="Add Finding" />
            </PopUpBase>

        </>
    )
}


{/* EDIT FINDING MODAL */}
type EditFindingModalProps = BaseModalProps & {
    finding: Partial<FindingFormData> | null
    members: { id: string; name: string }[]
    onSubmit: (data: Partial<FindingFormData>) => void
}

export function EditFindingModal({ isOpen, isDark, onClose, finding, members, onSubmit }: EditFindingModalProps) {
    const [form, setForm] = useState<FindingFormData>({
        vulnName: finding?.vulnName ?? '',
        executiveSummary: finding?.executiveSummary ?? '',
        vulnType: finding?.vulnType ?? '',
        wstgCode: finding?.wstgCode ?? '',
        impactedSystem: finding?.impactedSystem ?? '',
        cvssScore: finding?.cvssScore ?? 0,
        cvssVector: finding?.cvssVector ?? '',
        str: finding?.str ?? '',
        remediation: finding?.remediation ?? '',
        pocText: finding?.pocText ?? '',
        pocFiles: finding?.pocFiles ?? [],
        contributorName: finding?.contributorName ?? '',
    })

    const fileRef = useRef<HTMLInputElement>(null)

    const set = (key: keyof FindingFormData, val: unknown) => setForm((p) => ({ ...p, [key]: val }))
    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) set('pocFiles', [...form.pocFiles, ...Array.from(e.target.files)])
    }
    const removeFile = (i: number) => set('pocFiles', form.pocFiles.filter((_, idx) => idx !== i))

    const handleSubmit = () => {
        if (!form.vulnName.trim()) return
        onSubmit(form)
        onClose()
    }

    const optClass = isDark ? 'bg-[#0B2E46] text-white' : 'bg-white text-[#002C49]'
    const { label: cvssLabel, color: cvssColor } = cvssRating(form.cvssScore)

    return (
        <>
            <PopUpBase isOpen={isOpen} isDark={isDark} onClose={onClose} title="Edit Finding" maxWidth="max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Vulnerability Name <span className="text-red-400">*</span></Label>
                        <Input isDark={isDark} value={form.vulnName} onChange={(e) => set('vulnName', e.target.value)} />
                    </div>

                    <div>
                        <Label isDark={isDark}>Vulnerability Type</Label>
                        <Select isDark={isDark} value={form.vulnType} onChange={(e) => set('vulnType', e.target.value)}>
                            <option className={optClass} value="">Select type...</option>
                            <option className={optClass} value="Injection">Injection</option>
                            <option className={optClass} value="Broken Authentication">Broken Authentication</option>
                            <option className={optClass} value="XSS">XSS</option>
                            <option className={optClass} value="IDOR">IDOR</option>
                            <option className={optClass} value="Misconfiguration">Misconfiguration</option>
                            <option className={optClass} value="Sensitive Data Exposure">Sensitive Data Exposure</option>
                            <option className={optClass} value="Other">Other</option>
                        </Select>
                    </div>

                    <div>
                        <Label isDark={isDark}>Impacted System</Label>
                        <Input isDark={isDark} value={form.impactedSystem} onChange={(e) => set('impactedSystem', e.target.value)} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Executive Summary</Label>
                        <Textarea isDark={isDark} rows={3} value={form.executiveSummary} onChange={(e) => set('executiveSummary', e.target.value)} />
                    </div>

                    <div>
                        <Label isDark={isDark}>CVSS Score <span className="opacity-50 font-normal">(0–10)</span></Label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number" min={0} max={10} step={0.1}
                                value={form.cvssScore || ''}
                                onChange={e => set('cvssScore', parseFloat(e.target.value) || 0)}
                                placeholder="0.0"
                                className={`w-24 rounded-xl px-3 py-2.5 border text-sm font-montserrat font-bold focus:outline-none ${
                                    isDark ? 'bg-[#0B2E46] border-[#2BA7D6]/50 text-white placeholder:text-white/30' : 'bg-white border-[#1767AA]/30 text-[#002C49] placeholder:text-[#002C49]/30'
                                } ${form.cvssScore > 0 ? cvssColor : ''}`}
                            />
                            {form.cvssScore > 0 && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cvssColor} ${isDark ? 'bg-white/10' : 'bg-[#002C49]/5'}`}>
                                    {cvssLabel}
                                </span>
                            )}
                            <button
                                onClick={() => window.open('/cvss', '_blank')}
                                className={`ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-montserrat border transition ${
                                    isDark ? 'border-[#41B0EC] text-[#41B0EC] hover:bg-[#2BA7D6]/20' : 'border-[#1767AA] text-[#1767AA] hover:bg-[#27D6FF]/20'
                                }`}
                            >
                                <Calculator size={16} /> Recalculate
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label isDark={isDark}>CVSS Vector</Label>
                        <Input isDark={isDark} placeholder="CVSS:4.0/AV:N/AC:L/..." value={form.cvssVector} onChange={e => set('cvssVector', e.target.value)} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Steps to Reproduce (STR)</Label>
                        <Textarea isDark={isDark} rows={4} value={form.str} onChange={(e) => set('str', e.target.value)} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Remediation</Label>
                        <Textarea isDark={isDark} rows={3} value={form.remediation} onChange={(e) => set('remediation', e.target.value)} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Proof of Concept (PoC)</Label>
                        <Textarea isDark={isDark} rows={3} value={form.pocText} onChange={(e) => set('pocText', e.target.value)} />
                        <div
                            onClick={() => fileRef.current?.click()}
                            className={`mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 cursor-pointer transition ${
                                isDark ? 'border-[#2BA7D6]/40 hover:border-[#41B0EC] hover:bg-[#2BA7D6]/10' : 'border-[#1767AA]/30 hover:border-[#1767AA] hover:bg-[#27D6FF]/10'
                            }`}
                        >
                            <Upload size={20} className={isDark ? 'text-[#41B0EC]' : 'text-[#1767AA]'} />
                            <p className="text-xs font-montserrat opacity-60">Click to attach screenshots or files</p>
                        </div>
                        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
                        {form.pocFiles.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {form.pocFiles.map((f, i) => (
                                    <div key={i} className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-montserrat ${isDark ? 'bg-[#0B2E46]' : 'bg-[#EAF6FF]'}`}>
                                        <span className="truncate max-w-xs">{f.name}</span>
                                        <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-500 ml-2"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <Label isDark={isDark}>Contributor</Label>
                        <Select isDark={isDark} value={form.contributorName} onChange={(e) => set('contributorName', e.target.value)}>
                            <option className={optClass} value="">Select contributor...</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.name} className={optClass}>{m.name}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                <ModalFooter isDark={isDark} onClose={onClose} onConfirm={handleSubmit} confirmLabel="Save Changes" />
            </PopUpBase>

        </>
    )
}
