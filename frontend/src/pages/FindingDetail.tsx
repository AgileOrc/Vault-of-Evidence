import { useEffect, useRef, useState } from 'react'
import { User, Calendar, X, Pencil, Trash2, Plus, Upload, Loader2, FileDown } from 'lucide-react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'
import api from '../api/axios'
import { getPageTheme } from '../utils/theme'
import jsPDF from 'jspdf'

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
    wstgCode: string
    impactedSystem: string
    executiveSummary: string
    stepsToReproduce: string
    remediationStrategy: string
    notes: string
}
// isLocal = belum diupload ke backend (hanya ada di state sementara)
type PoC = {
    id: string
    type: 'screenshot' | 'request'
    caption: string
    content: string   // screenshot → URL download; request → teks mentah
    isLocal?: boolean // true = belum ada di backend
}

const btnBase  = 'flex items-center gap-2 px-2 md:px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-md md:rounded-lg border font-semibold text-xs xl:text-sm font-montserrat'
const iconSize = 'w-3 h-3 md:w-4 md:h-4'
const STATUSES = ['open', 'confirmed', 'fixing', 'fixed', 'closed_on_notes'] as const
const inputClass = (isDark: boolean) =>
    `w-full rounded-lg px-3 py-2 text-sm border font-montserrat focus:outline-none ${
        isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
               : 'bg-[#002C49]/5 border-[#002C49]/20 text-[#002C49] placeholder:text-[#002C49]/40'
    }`
const textareaClass = (isDark: boolean) => inputClass(isDark) + ' resize-none'
const monoClass    = (isDark: boolean) => inputClass(isDark).replace('font-montserrat', 'font-mono')

// ── Magic bytes untuk PNG dan JPEG ──────────────────────────────────────────
const IMG_SIGNATURES: { mime: string; bytes: number[] }[] = [
    { mime: 'image/png',  bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
    { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
]
const ALLOWED_IMG_EXTS = ['.png', '.jpg', '.jpeg']
const MAX_IMG_MB = 10

function validateImageMagic(file: File): Promise<boolean> {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => {
            const buf = new Uint8Array(e.target?.result as ArrayBuffer)
            const ok  = IMG_SIGNATURES.some(sig =>
                sig.bytes.every((b, i) => buf[i] === b)
            )
            resolve(ok)
        }
        reader.onerror = () => resolve(false)
        reader.readAsArrayBuffer(file.slice(0, 12))
    })
}

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
    const navigate = useNavigate()
    const theme = getPageTheme(isDark)

    const [loading,      setLoading]      = useState(true)
    const [isEditing,    setIsEditing]    = useState(false)
    const [userRole,     setUserRole]     = useState<'pm' | 'dev' | 'pentester'>('pm')
    const [project,      setProject]      = useState<ProjectData | null>(null)
    const [worklist,     setWorklist]     = useState<WorklistData | null>(null)
    const [finding,      setFinding]      = useState<FindingData | null>(null)
    const [editData,     setEditData]     = useState<FindingData | null>(null)
    const [pocs,         setPocs]         = useState<PoC[]>([])
    const [openModal,    setOpenModal]    = useState<string | null>(null)
    const [lastUpdated,  setLastUpdated]  = useState<string | null>(null)
    const [uploadingPoc,      setUploadingPoc]      = useState(false)
    const [pocError,          setPocError]          = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deletingFinding,   setDeletingFinding]   = useState(false)
    const [generatingPdf,     setGeneratingPdf]     = useState(false)

    // ref untuk hidden file input screenshot
    const screenshotInputRef  = useRef<HTMLInputElement>(null)
    // id poc yang sedang di-replace (null = upload baru)
    const replacePocIdRef     = useRef<string | null>(null)
    // state edit sementara untuk request poc yang belum disimpan
    const [editingRequest, setEditingRequest] = useState<{ id: string; caption: string; content: string } | null>(null)

    useEffect(() => {
        Promise.all([
            api.get(`/projects/${projectId}`),
            api.get(`/projects/${projectId}/worklists/${worklistId}`),
            api.get(`/projects/${projectId}/findings/${findingId}`),
            api.get(`/projects/${projectId}/findings/${findingId}/evidence`),
            api.get('/auth/me'),
        ]).then(async ([projRes, wlRes, fRes, evRes, meRes]) => {
            setProject(projRes.data.data)
            setWorklist(wlRes.data.data)

            const raw = fRes.data.data
            setFinding({
                id: raw.id,
                name: raw.title,
                code: raw.wstg_code || '—',
                status: raw.status,
                severity: raw.severity,
                confirmDate: new Date(raw.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                member: raw.contributor || '—',
                cvssScore: raw.cvss_score,
                cvssVector: raw.cvss_vector || '',
                wstgCode: raw.wstg_code || '',
                impactedSystem: raw.impact || '',
                executiveSummary: raw.description || '',
                stepsToReproduce: raw.reproduction_steps || '',
                remediationStrategy: raw.remediation || '',
                notes: raw.notes || '',
            })

            const evidences: any[] = evRes.data.data || []

            // Fetch semua evidence:
            // - gambar   → fetch blob → createObjectURL (supaya auth header terkirim)
            // - teks     → fetch text content langsung
            const pocList: PoC[] = await Promise.all(
                evidences.map(async ev => {
                    const isImage = ev.mime_type?.startsWith('image/')
                    const dlPath  = `/projects/${projectId}/findings/${findingId}/evidence/${ev.id}/download`
                    let content   = ''
                    if (isImage) {
                        try {
                            const r = await api.get(dlPath, { responseType: 'blob' })
                            content = URL.createObjectURL(r.data)
                        } catch { content = '' }
                    } else {
                        try {
                            const r = await api.get(dlPath, { responseType: 'text' })
                            content = typeof r.data === 'string' ? r.data : JSON.stringify(r.data, null, 2)
                        } catch { content = '(failed to load content)' }
                    }
                    // strip file extension dari caption
                    const caption = ev.file_name.replace(/\.[^.]+$/, '')
                    return {
                        id: ev.id,
                        type: isImage ? 'screenshot' : 'request' as 'screenshot' | 'request',
                        caption,
                        content,
                        isLocal: false,
                    }
                })
            )
            setPocs(pocList)

            setUserRole(meRes.data.data?.projectRole ?? 'pm')
            setLoading(false)
        }).catch(err => {
            console.error('Failed to load finding details:', err)
            setLoading(false)
        })
    }, [projectId, worklistId, findingId])

    const isPentester = userRole === 'pentester'
    const isDev       = userRole === 'dev'
    const canEditPoc  = isEditing && !isDev

    const currentFinding = isEditing ? editData : finding

    // ── helpers ─────────────────────────────────────────────────────────────
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
            if (s === 'closed_on_notes') return 'bg-[#27D6FF] text-[#00375C]'
            return 'text-[#27D6FF] border border-[#27D6FF]'
        }
        if (s === 'confirmed')       return 'bg-[#1767AA] text-[#F5F5F5]'
        if (s === 'fixing')          return 'bg-[#1767AA] text-[#27D6FF]'
        if (s === 'fixed')           return 'bg-[#002C49] text-[#DCF3F8]'
        if (s === 'closed_on_notes') return 'bg-[#00375C] text-[#22BBDE]'
        return 'text-[#1767AA] border border-[#1767AA]'
    }

    const capitalize = (s: string) =>
        s.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    const modalTitle = (key: string) => {
        const map: Record<string, string> = {
            cvss: 'CVSS Score',
            wstgCode: 'WSTG Code',
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

    // ── PoC handlers ─────────────────────────────────────────────────────────

    /** Validasi + upload file gambar ke backend */
    const handleScreenshotFile = async (file: File, replacingId?: string) => {
        setPocError(null)

        // 1. Cek ekstensi
        const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? ''
        if (!ALLOWED_IMG_EXTS.includes(ext)) {
            setPocError(`Format tidak didukung. Hanya ${ALLOWED_IMG_EXTS.join(', ')} yang diizinkan.`)
            return
        }

        // 2. Cek ukuran
        if (file.size > MAX_IMG_MB * 1024 * 1024) {
            setPocError(`Ukuran file melebihi batas ${MAX_IMG_MB}MB.`)
            return
        }

        // 3. Validasi magic bytes (baca 12 byte pertama)
        const validMagic = await validateImageMagic(file)
        if (!validMagic) {
            setPocError('File bukan gambar valid (header tidak cocok dengan PNG/JPEG).')
            return
        }

        // 4. Hapus entry lama jika replace
        if (replacingId) {
            const isUUID = /^[0-9a-f-]{36}$/i.test(replacingId)
            if (isUUID) {
                try {
                    await api.delete(`/projects/${projectId}/findings/${findingId}/evidence/${replacingId}`)
                } catch { /* lanjut saja */ }
            }
            setPocs(prev => prev.filter(p => p.id !== replacingId))
        }

        // 5. Upload ke backend
        setUploadingPoc(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            const res = await api.post(
                `/projects/${projectId}/findings/${findingId}/evidence`,
                fd,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            const ev = res.data.data
            // Fetch blob agar gambar bisa tampil (endpoint butuh auth)
            let blobUrl = ''
            try {
                const dlRes = await api.get(
                    `/projects/${projectId}/findings/${findingId}/evidence/${ev.id}/download`,
                    { responseType: 'blob' }
                )
                blobUrl = URL.createObjectURL(dlRes.data)
            } catch { blobUrl = '' }

            const newPoc: PoC = {
                id: ev.id,
                type: 'screenshot',
                caption: ev.file_name.replace(/\.[^.]+$/, ''),
                content: blobUrl,
                isLocal: false,
            }
            setPocs(prev => [...prev, newPoc])
            // Tutup modal replace jika ada
            if (replacingId) setOpenModal(null)
        } catch (err: any) {
            setPocError(err.response?.data?.error ?? 'Upload gagal.')
        } finally {
            setUploadingPoc(false)
            // reset file input agar bisa pilih file yang sama lagi
            if (screenshotInputRef.current) screenshotInputRef.current.value = ''
        }
    }

    /** Upload konten teks sebagai .txt ke backend */
    const handleSaveRequestPoc = async (pocId: string, caption: string, content: string) => {
        setPocError(null)
        if (!content.trim()) {
            setPocError('Konten tidak boleh kosong.')
            return
        }

        const safeName = (caption.trim() || 'request').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
        const blob = new Blob([content], { type: 'text/plain' })
        const file = new File([blob], `${safeName}.txt`, { type: 'text/plain' })
        const fd   = new FormData()
        fd.append('file', file)

        setUploadingPoc(true)
        try {
            // Jika ada entry lama yang sudah di backend, hapus dulu
            const isUUID = /^[0-9a-f-]{36}$/i.test(pocId)
            if (isUUID) {
                try {
                    await api.delete(`/projects/${projectId}/findings/${findingId}/evidence/${pocId}`)
                } catch { /* lanjut */ }
            }

            const res = await api.post(
                `/projects/${projectId}/findings/${findingId}/evidence`,
                fd,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            const ev = res.data.data
            setPocs(prev => [
                ...prev.filter(p => p.id !== pocId),
                {
                    id: ev.id,
                    type: 'request',
                    caption: caption.trim() || ev.file_name.replace(/\.[^.]+$/, ''),
                    content,          // simpan teks lokal untuk tampilan
                    isLocal: false,
                }
            ])
            setEditingRequest(null)
            setOpenModal(null)
        } catch (err: any) {
            setPocError(err.response?.data?.error ?? 'Upload gagal.')
        } finally {
            setUploadingPoc(false)
        }
    }

    /** Hapus evidence dari backend + state */
    const handleDeletePoc = async (pocId: string) => {
        const isUUID = /^[0-9a-f-]{36}$/i.test(pocId)
        if (isUUID) {
            try {
                await api.delete(`/projects/${projectId}/findings/${findingId}/evidence/${pocId}`)
            } catch (err) {
                alert('Gagal menghapus evidence dari server.')
                return
            }
        }
        setPocs(prev => prev.filter(p => p.id !== pocId))
        setEditingRequest(null)
        setOpenModal(null)
    }

    // ── main save ────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!editData) return
        try {
            await api.put(`/projects/${projectId}/findings/${findingId}`, {
                title: editData.name,
                status: editData.status,
                severity: editData.severity,
                cvss_score: editData.cvssScore,
                cvss_vector: editData.cvssVector,
                wstg_code: editData.wstgCode,
                impact: editData.impactedSystem,
                description: editData.executiveSummary,
                reproduction_steps: editData.stepsToReproduce,
                remediation: editData.remediationStrategy,
                notes: editData.notes,
            })
            setFinding(editData)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update finding', error)
            alert('Failed to update finding details.')
        }
    }

    // ── PDF generation ───────────────────────────────────────────────────────
    const blobUrlToBase64 = (blobUrl: string): Promise<string> =>
        fetch(blobUrl)
            .then(r => r.blob())
            .then(blob => new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result as string)
                reader.onerror   = reject
                reader.readAsDataURL(blob)
            }))

    const handleDownloadPDF = async () => {
        if (!finding) return
        setGeneratingPdf(true)
        try {
            const f   = finding
            const doc = new jsPDF({ unit: 'mm', format: 'a4' })
            const pageW   = doc.internal.pageSize.getWidth()
            const pageH   = doc.internal.pageSize.getHeight()
            const margin  = 18
            const col     = pageW - margin * 2
            let y = margin

            // ── helpers ──────────────────────────────────────────────────────
            const checkPage = (needed = 10) => {
                if (y + needed > pageH - margin) { doc.addPage(); y = margin }
            }

            const addHeading = (text: string, size = 11) => {
                checkPage(10)
                doc.setFontSize(size)
                doc.setFont('helvetica', 'bold')
                doc.setTextColor(0, 44, 73)
                doc.text(text, margin, y)
                y += size * 0.45 + 3
            }

            const addBody = (text: string, size = 9) => {
                doc.setFontSize(size)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(60, 60, 60)
                const lines = doc.splitTextToSize(text || '—', col)
                lines.forEach((line: string) => {
                    checkPage(size * 0.45 + 2)
                    doc.text(line, margin, y)
                    y += size * 0.45 + 1.5
                })
                y += 2
            }

            const addKV = (key: string, value: string) => {
                checkPage(8)
                doc.setFontSize(9)
                doc.setFont('helvetica', 'bold')
                doc.setTextColor(80, 80, 80)
                doc.text(`${key}:`, margin, y)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(30, 30, 30)
                const lines = doc.splitTextToSize(value || '—', col - 35)
                doc.text(lines[0], margin + 35, y)
                y += 5.5
                if (lines.length > 1) {
                    lines.slice(1).forEach((l: string) => {
                        checkPage(5)
                        doc.text(l, margin + 35, y)
                        y += 5
                    })
                }
            }

            const addDivider = () => {
                checkPage(6)
                doc.setDrawColor(200, 200, 200)
                doc.line(margin, y, pageW - margin, y)
                y += 5
            }

            const addSectionTitle = (title: string) => {
                checkPage(14)
                y += 3
                doc.setFillColor(0, 44, 73)
                doc.roundedRect(margin, y - 4, col, 8, 1, 1, 'F')
                doc.setFontSize(10)
                doc.setFont('helvetica', 'bold')
                doc.setTextColor(255, 255, 255)
                doc.text(title, margin + 3, y + 0.5)
                doc.setTextColor(0, 0, 0)
                y += 9
            }

            // ── Cover / Header ────────────────────────────────────────────────
            doc.setFillColor(0, 44, 73)
            doc.rect(0, 0, pageW, 28, 'F')
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(255, 255, 255)
            doc.text('Finding Report', margin, 14)
            doc.setFontSize(9)
            doc.setFont('helvetica', 'normal')
            doc.text(`${project?.name ?? ''} › ${worklist?.name ?? ''}`, margin, 21)
            doc.text(`Generated: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`, pageW - margin, 21, { align: 'right' })
            y = 36

            // ── Finding Identity ──────────────────────────────────────────────
            addHeading(f.name, 14)
            y += 1
            addKV('Code',       f.code)
            addKV('Status',     f.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
            addKV('Severity',   f.severity.charAt(0).toUpperCase() + f.severity.slice(1))
            addKV('Date',       f.confirmDate)
            addKV('Contributor',f.member)
            addDivider()

            // ── CVSS ──────────────────────────────────────────────────────────
            addSectionTitle('CVSS Score')
            addKV('Score',  f.cvssScore !== null ? String(f.cvssScore) : '—')
            addKV('Vector', f.cvssVector || '—')

            // ── Impacted System ───────────────────────────────────────────────
            addSectionTitle('Impacted System')
            addBody(f.impactedSystem)

            // ── WSTG Code ────────────────────────────────────────────────────
            addSectionTitle('WSTG Code')
            addBody(f.wstgCode)

            // ── Executive Summary ─────────────────────────────────────────────
            addSectionTitle('Executive Summary')
            addBody(f.executiveSummary)

            // ── Steps to Reproduce ────────────────────────────────────────────
            addSectionTitle('Steps to Reproduce')
            addBody(f.stepsToReproduce)

            // ── Remediation Strategy ──────────────────────────────────────────
            addSectionTitle('Remediation Strategy')
            addBody(f.remediationStrategy)

            // ── Notes (only if closed_on_notes) ──────────────────────────────
            if (f.status === 'closed_on_notes') {
                addSectionTitle('Notes')
                addBody(f.notes)
            }

            // ── Proof of Concept – Screenshots ───────────────────────────────
            const screenshots = pocs.filter(p => p.type === 'screenshot')
            if (screenshots.length > 0) {
                addSectionTitle('Proof of Concept – Screenshots')
                for (const poc of screenshots) {
                    try {
                        const b64 = await blobUrlToBase64(poc.content)
                        // tentukan dimensi agar pas di halaman
                        const imgW = col
                        const imgH = 70
                        checkPage(imgH + 10)
                        addBody(poc.caption)
                        y += 1
                        doc.addImage(b64, 'JPEG', margin, y, imgW, imgH, undefined, 'FAST')
                        y += imgH + 5
                    } catch { /* skip gambar yang gagal */ }
                }
            }

            // ── Proof of Concept – Requests ───────────────────────────────────
            const requests = pocs.filter(p => p.type === 'request')
            if (requests.length > 0) {
                addSectionTitle('Proof of Concept – Requests & Responses')
                for (const poc of requests) {
                    checkPage(10)
                    doc.setFontSize(9)
                    doc.setFont('helvetica', 'bold')
                    doc.setTextColor(0, 44, 73)
                    doc.text(poc.caption, margin, y)
                    y += 5
                    doc.setFont('courier', 'normal')
                    doc.setFontSize(8)
                    doc.setTextColor(40, 40, 40)
                    const lines = doc.splitTextToSize(poc.content || '(empty)', col)
                    lines.forEach((line: string) => {
                        checkPage(4.5)
                        doc.text(line, margin, y)
                        y += 4.5
                    })
                    y += 4
                }
            }

            // ── Footer pada setiap halaman ────────────────────────────────────
            const totalPages = (doc.internal as any).getNumberOfPages()
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i)
                doc.setFontSize(7.5)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(150, 150, 150)
                doc.text(
                    `${project?.name ?? ''} – ${f.name} | Page ${i} of ${totalPages}`,
                    pageW / 2, pageH - 8, { align: 'center' }
                )
            }

            const safeName = f.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 60)
            doc.save(`${safeName}_finding_report.pdf`)
        } catch (err) {
            console.error('PDF generation failed', err)
            alert('Gagal membuat PDF.')
        } finally {
            setGeneratingPdf(false)
        }
    }

    const handleDeleteFinding = async () => {
        setDeletingFinding(true)
        try {
            await api.delete(`/projects/${projectId}/findings/${findingId}`)
            navigate(`/projects/${projectId}/worklists/${worklistId}/findings`, { replace: true })
        } catch (err) {
            console.error('Failed to delete finding', err)
            alert('Gagal menghapus finding.')
            setDeletingFinding(false)
            setShowDeleteConfirm(false)
        }
    }

    if (loading) {
        return <div className='text-center p-10 font-montserrat'>Loading Finding...</div>
    }
    if (!currentFinding) return null

    return (
        <div className='space-y-4 md:space-y-6 font-montserrat'>

            {/* Hidden file input untuk screenshot */}
            <input
                ref={screenshotInputRef}
                type='file'
                accept='.png,.jpg,.jpeg'
                className='hidden'
                onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleScreenshotFile(file, replacePocIdRef.current ?? undefined)
                    replacePocIdRef.current = null
                }}
            />

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className='space-y-2'>
                <p className={`text-sm md:text-base font-medium ${theme.textMuted}`}>
                    {project?.name} &rsaquo; {worklist?.name}
                </p>

                <h1 className={`text-2xl md:text-3xl xl:text-4xl font-semibold ${theme.text}`}>
                    {currentFinding.name}
                </h1>

                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
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

                    <div className='flex gap-2 shrink-0'>
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className={`${btnBase} border-transparent ${theme.buttonPrimary}`}>
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
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className={`${btnBase} ${theme.buttonDanger}`}
                                >
                                    <Trash2 className={iconSize} /> Delete Finding
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Finding Status */}
            <div className={`flex flex-col gap-y-1 rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 space-y-3 ${theme.cardBase}`}>
                <div>
                    <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>Finding Status</p>
                    <p className={`text-sm lg:text-md font-medium ${theme.textMuted}`}>
                        {isPentester
                            ? 'Only project manager and developer can update status'
                            : 'Only developer and project manager can update'}
                    </p>
                </div>
                <div className='flex flex-wrap gap-2 items-center'>
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

                {/* Notes — muncul hanya saat status closed_on_notes */}
                {currentFinding.status === 'closed_on_notes' && (
                    <div className='space-y-1.5'>
                        <label className={`flex items-center gap-1.5 text-md font-semibold px-1 ${theme.textMuted}`}>
                            {/* <span className={`inline-block w-2 h-2 rounded-full ${statusBadgeClass('closed_on_notes')}`} /> */}
                            Input Notes Here 
                        </label>
                        {isEditing && !isPentester ? (
                            <textarea
                                rows={3}
                                maxLength={2000}
                                placeholder='Tuliskan alasan finding ditutup dengan catatan...'
                                value={editData?.notes ?? ''}
                                onChange={e => setEdit({ notes: e.target.value })}
                                className={textareaClass(isDark)}
                            />
                        ) : (
                            <p className={`text-sm font-medium leading-relaxed whitespace-pre-line px-1 ${
                                currentFinding.notes
                                    ? theme.text
                                    : `${theme.textMuted} opacity-50 italic`
                            }`}>
                                {currentFinding.notes || 'Tidak ada catatan.'}
                            </p>
                        )}
                    </div>
                )}

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

            {/* WSTG Code */}
            <button
                onClick={() => setOpenModal('wstgCode')}
                className={`w-full text-left rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 transition hover:scale-[1.01] ${theme.cardBase}`}
            >
                <div className='flex flex-col gap-1'>
                    <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>WSTG Code</p>
                    <p className={`text-sm lg:text-base font-medium ${theme.textMuted}`}>
                        {currentFinding.wstgCode || '—'}
                    </p>
                </div>
            </button>

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

            {/* ── Proof of Concept ──────────────────────────────────────────────── */}
            <div className={`rounded-xl md:rounded-2xl px-6 py-5 md:px-7 md:py-6 space-y-5 ${theme.cardBase}`}>
                <p className={`text-lg lg:text-xl font-semibold ${theme.text}`}>Proof of Concept</p>

                {/* Error banner */}
                {pocError && (
                    <div className='flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 bg-red-500/15 border border-red-500/30'>
                        <p className='text-xs font-medium text-red-400'>{pocError}</p>
                        <button onClick={() => setPocError(null)} className='text-red-400 hover:opacity-70'><X size={14} /></button>
                    </div>
                )}

                {/* Screenshots */}
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <p className={`text-sm lg:text-md font-medium ${theme.textMuted}`}>Screenshots</p>
                        {canEditPoc && (
                            <button
                                disabled={uploadingPoc}
                                onClick={() => {
                                    replacePocIdRef.current = null
                                    screenshotInputRef.current?.click()
                                }}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${theme.buttonOutline} disabled:opacity-50`}
                            >
                                {uploadingPoc ? <Loader2 size={12} className='animate-spin' /> : <Plus size={12} />} Add
                            </button>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-3'>
                        {pocs.filter(p => p.type === 'screenshot').map(poc => (
                            <button
                                key={poc.id}
                                onClick={() => { setPocError(null); setOpenModal(`poc-${poc.id}`) }}
                                className={`relative w-24 h-24 md:w-32 md:h-32 rounded-lg flex items-center justify-center text-xs font-medium transition hover:scale-[1.02] overflow-hidden ${theme.cardBase}`}
                            >
                                <img src={poc.content} alt={poc.caption} className='w-full h-full object-cover rounded-lg' />
                                <span className={`absolute bottom-0 left-0 right-0 text-center text-[10px] px-1 py-0.5 truncate ${isDark ? 'bg-black/60 text-white' : 'bg-white/80 text-[#002C49]'}`}>
                                    {poc.caption}
                                </span>
                            </button>
                        ))}
                        {pocs.filter(p => p.type === 'screenshot').length === 0 && (
                            <p className={`text-xs ${theme.textMuted} opacity-60`}>Belum ada screenshot.</p>
                        )}
                    </div>
                </div>

                {/* Requests & Responses */}
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <p className={`text-sm lg:text-md font-medium ${theme.textMuted}`}>Requests &amp; Responses</p>
                        {canEditPoc && (
                            <button
                                onClick={() => {
                                    const tempId = `local-${Date.now()}`
                                    setPocs(prev => [...prev, { id: tempId, type: 'request', caption: 'New Request', content: '', isLocal: true }])
                                    setEditingRequest({ id: tempId, caption: 'New Request', content: '' })
                                    setOpenModal(`poc-${tempId}`)
                                }}
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
                                onClick={() => {
                                    setPocError(null)
                                    setEditingRequest({ id: poc.id, caption: poc.caption, content: poc.content })
                                    setOpenModal(`poc-${poc.id}`)
                                }}
                                className={`text-left rounded-lg px-4 py-3 transition hover:scale-[1.005] ${theme.cardBase}`}
                            >
                                <p className={`text-xs font-semibold mb-1 ${theme.textMuted}`}>{poc.caption}</p>
                                <pre className={`text-xs font-mono line-clamp-3 whitespace-pre-wrap break-all ${theme.text}`}>
                                    {poc.content || '(kosong)'}
                                </pre>
                            </button>
                        ))}
                        {pocs.filter(p => p.type === 'request').length === 0 && (
                            <p className={`text-xs ${theme.textMuted} opacity-60`}>Belum ada request/response.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Download PDF (floating bottom-right) ─────────────────────────── */}
            <div className='flex justify-end pt-2 pb-4'>
                <button
                    onClick={handleDownloadPDF}
                    disabled={generatingPdf}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm font-montserrat shadow-lg transition hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed ${
                        isDark
                            ? 'bg-[#27D6FF] text-[#002C49] hover:bg-[#1ab8e0]'
                            : 'bg-[#1767AA] text-white hover:bg-[#0f4f88]'
                    }`}
                >
                    {generatingPdf
                        ? <><Loader2 size={16} className='animate-spin' /> Generating PDF…</>
                        : <><FileDown size={16} /> Download PDF</>
                    }
                </button>
            </div>

            {/* ── Delete Finding Confirm ────────────────────────────────────────── */}
            {showDeleteConfirm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={() => !deletingFinding && setShowDeleteConfirm(false)} />
                    <div className={`relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 ${isDark ? 'bg-[#0B2E46] border border-[#27D6FF]/40' : 'bg-white border border-[#27D6FF]/40'}`}>
                        <div className='flex flex-col items-center gap-3 text-center'>
                            <div className='w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center'>
                                <Trash2 size={22} className='text-red-500' />
                            </div>
                            <h3 className={`text-lg font-semibold font-montserrat ${theme.text}`}>
                                Delete <span className='text-red-500'>{finding?.name}</span>?
                            </h3>
                            <p className={`text-sm font-montserrat ${theme.textMuted}`}>
                                Finding ini akan dihapus permanen beserta semua evidence-nya. Tindakan ini tidak bisa dibatalkan.
                            </p>
                        </div>
                        <div className='flex gap-3 justify-center pt-2'>
                            <button
                                disabled={deletingFinding}
                                onClick={() => setShowDeleteConfirm(false)}
                                className={`${btnBase} ${theme.buttonOutline} disabled:opacity-50`}
                            >
                                Batal
                            </button>
                            <button
                                disabled={deletingFinding}
                                onClick={handleDeleteFinding}
                                className={`${btnBase} border-transparent bg-red-500 hover:bg-red-600 text-white disabled:opacity-50`}
                            >
                                {deletingFinding ? <Loader2 size={14} className='animate-spin' /> : <Trash2 size={14} />}
                                {deletingFinding ? 'Menghapus...' : 'Delete Finding'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modals ────────────────────────────────────────────────────────── */}
            {openModal && (
                <CardModal
                    isDark={isDark}
                    theme={theme}
                    title={modalTitle(openModal)}
                    onClose={() => { setOpenModal(null); setPocError(null) }}
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

                    {/* WSTG Code */}
                    {openModal === 'wstgCode' && (
                        <div>
                            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-white/60' : theme.textMuted}`}>WSTG Code</label>
                            {isEditing && !isDev ? (
                                <input type='text' maxLength={50} placeholder='e.g. WSTG-ATHN-01'
                                    value={editData?.wstgCode ?? ''}
                                    onChange={e => setEdit({ wstgCode: e.target.value })}
                                    className={inputClass(isDark)}
                                />
                            ) : (
                                <p className={`text-sm lg:text-base font-medium leading-relaxed ${theme.text}`}>{currentFinding.wstgCode || '—'}</p>
                            )}
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

                        // ── Screenshot modal ─────────────────────────────────
                        if (poc.type === 'screenshot') {
                            return (
                                <div className='space-y-4'>
                                    {/* Gambar */}
                                    <div className={`w-full rounded-xl overflow-hidden flex items-center justify-center min-h-40 ${theme.cardBase}`}>
                                        <img
                                            src={poc.content}
                                            alt={poc.caption}
                                            className='max-w-full max-h-[50vh] object-contain rounded-xl'
                                        />
                                    </div>

                                    <p className={`text-sm font-semibold ${theme.text}`}>{poc.caption}</p>

                                    {/* Error */}
                                    {pocError && (
                                        <div className='rounded-lg px-3 py-2 bg-red-500/15 border border-red-500/30'>
                                            <p className='text-xs font-medium text-red-400'>{pocError}</p>
                                        </div>
                                    )}

                                    {canEditPoc && (
                                        <div className='flex gap-2 flex-wrap'>
                                            {/* Ganti gambar */}
                                            <button
                                                disabled={uploadingPoc}
                                                onClick={() => {
                                                    setPocError(null)
                                                    replacePocIdRef.current = poc.id
                                                    screenshotInputRef.current?.click()
                                                }}
                                                className={`${btnBase} ${theme.buttonOutline} disabled:opacity-50`}
                                            >
                                                {uploadingPoc
                                                    ? <><Loader2 size={14} className='animate-spin' /> Uploading…</>
                                                    : <><Upload size={14} /> Ganti Gambar</>
                                                }
                                            </button>
                                            {/* Hapus */}
                                            <button
                                                disabled={uploadingPoc}
                                                onClick={() => handleDeletePoc(poc.id)}
                                                className={`${btnBase} ${theme.buttonDanger} disabled:opacity-50`}
                                            >
                                                <Trash2 size={14} /> Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        // ── Request modal ────────────────────────────────────
                        const reqEdit = editingRequest?.id === poc.id ? editingRequest : null

                        return (
                            <div className='space-y-4'>
                                {/* Caption */}
                                <div>
                                    <label className={`block text-xs font-semibold mb-1 ${theme.textMuted}`}>Caption</label>
                                    {canEditPoc ? (
                                        <input type='text' maxLength={100}
                                            value={reqEdit?.caption ?? poc.caption}
                                            onChange={e => setEditingRequest(prev => prev ? { ...prev, caption: e.target.value } : { id: poc.id, caption: e.target.value, content: poc.content })}
                                            className={inputClass(isDark)}
                                        />
                                    ) : (
                                        <p className={`text-sm font-semibold ${theme.text}`}>{poc.caption}</p>
                                    )}
                                </div>

                                {/* Konten */}
                                <div>
                                    <label className={`block text-xs font-semibold mb-1 ${theme.textMuted}`}>Content</label>
                                    {canEditPoc ? (
                                        <textarea maxLength={8000} rows={12}
                                            placeholder='GET /api/users/1 HTTP/1.1&#10;Host: example.com&#10;...'
                                            value={reqEdit?.content ?? poc.content}
                                            onChange={e => setEditingRequest(prev => prev ? { ...prev, content: e.target.value } : { id: poc.id, caption: poc.caption, content: e.target.value })}
                                            className={monoClass(isDark)}
                                        />
                                    ) : (
                                        <pre className={`text-xs font-mono whitespace-pre-wrap break-all rounded-lg p-3 ${
                                            isDark ? 'bg-white/10' : 'bg-[#002C49]/5'
                                        } ${theme.text}`}>
                                            {poc.content || '(kosong)'}
                                        </pre>
                                    )}
                                </div>

                                {/* Error */}
                                {pocError && (
                                    <div className='rounded-lg px-3 py-2 bg-red-500/15 border border-red-500/30'>
                                        <p className='text-xs font-medium text-red-400'>{pocError}</p>
                                    </div>
                                )}

                                {canEditPoc && (
                                    <div className='flex gap-2 flex-wrap'>
                                        {/* Simpan ke server */}
                                        <button
                                            disabled={uploadingPoc}
                                            onClick={() => handleSaveRequestPoc(
                                                poc.id,
                                                reqEdit?.caption ?? poc.caption,
                                                reqEdit?.content ?? poc.content
                                            )}
                                            className={`${btnBase} border-transparent ${theme.buttonPrimary} disabled:opacity-50`}
                                        >
                                            {uploadingPoc
                                                ? <><Loader2 size={14} className='animate-spin' /> Menyimpan…</>
                                                : 'Simpan'
                                            }
                                        </button>
                                        {/* Hapus */}
                                        <button
                                            disabled={uploadingPoc}
                                            onClick={() => handleDeletePoc(poc.id)}
                                            className={`${btnBase} ${theme.buttonDanger} disabled:opacity-50`}
                                        >
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
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
