import { useEffect, useState } from 'react'
import {
    Users,
    FileText,
    Bug,
    Plus, 
    Search, 
    ChevronDown,
    Trash2,
    FilePlusCorner,
    Pencil
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
}

type WorklistData = {
    id: string
    name: string
    code: string
    findings: number
    status: string
}

function ProjectDetails () {
    const { isDark } = useOutletContext<LayoutContext>()
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const [projects, setProjects] = useState<ProjectData[]>([])
    const [worklist, setWorklist] = useState<WorklistData[]>([])

    useEffect(() => {
        api.get('/projects/details')
            .then((res) => {
                setProjects(res.data.projects)
                setLoading(false)
            })
            .catch(() => {
                setWorklist([
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
    }, [])

    const filteredWorklists = worklist.filter((worklist) => {
        const matchSearch = worklist.name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchStatus = statusFilter === 'all' || worklist.status.toLowerCase() === statusFilter.toLowerCase()

        return matchSearch && matchStatus
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

    return (
        <h1> Project Details </h1>
    )
}

export default ProjectDetails;