import { ChevronDown, Plus, Search, Globe, Users, ClipboardList, Bug } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'

const projects = [
  {
    name: 'mycompany.com',
    type: 'Web Application',
    members: 5,
    worklists: 6,
    findings: 23,
    status: 'Active'
  },
  {
    name: 'api.startup.io',
    type: 'API Security',
    members: 3,
    worklists: 4,
    findings: 11,
    status: 'Active'
  },
  {
    name: 'staging.app.io',
    type: 'Web Application',
    members: 4,
    worklists: 7,
    findings: 15,
    status: 'Paused'
  },
  {
    name: 'newclient.com',
    type: 'Web Application',
    members: 6,
    worklists: 0,
    findings: 0,
    status: 'Upcoming'
  },
  {
    name: 'corp.enterprise.com',
    type: 'Internal Network',
    members: 4,
    worklists: 18,
    findings: 27,
    status: 'Completed'
  }
]

function Projects () {
  const { isDark } = useOutletContext<LayoutContext>()

  const cardBase = isDark
    ? 'bg-linear-to-br from-[#1767AA] to-[#002C49] border border-[#27D6FF]/20 text-[#F5F5F5]'
    : 'bg-[#F5F5F5] border border-[#27D6FF]/40 text-[#002C49] shadow-sm'

  const badgeClass = (status: string) => {
    if (status === 'Active') return 'bg-[#27D6FF] text-[#002C49]'
    if (status === 'Paused') return 'bg-[#20A6DA] text-[#002C49]'
    if (status === 'Upcoming') return 'bg-[#1767AA] text-[#F5F5F5]'
    return 'bg-[#002C49] text-[#F5F5F5]'
  }

  return (
    <div className='space-y-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-semibold'>Your Projects</h1>
          <p className='mt-1 text-sm opacity-80'>All penetration testing engagements</p>
        </div>
        <button
          type='button'
          className='flex items-center gap-2 rounded-lg bg-[#27D6FF] px-4 py-2 text-sm font-semibold text-[#002C49]'
        >
          <Plus className='h-4 w-4' />
          New Project
        </button>
      </header>

      <div className='flex flex-wrap items-center gap-4'>
        <div className='relative w-full max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#20A6DA]' />
          <input
            type='text'
            placeholder='Search projects ...'
            className={`w-full rounded-lg border px-9 py-2 text-sm outline-none ${
              isDark
                ? 'border-[#27D6FF]/30 bg-[#002C49] text-[#F5F5F5]'
                : 'border-[#27D6FF]/40 bg-[#F5F5F5] text-[#002C49]'
            }`}
          />
        </div>
        <button
          type='button'
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${
            isDark
              ? 'border-[#27D6FF]/30 bg-[#1767AA] text-[#F5F5F5]'
              : 'border-[#27D6FF]/40 bg-[#F5F5F5] text-[#1767AA]'
          }`}
        >
          All status
          <ChevronDown className='h-4 w-4' />
        </button>
      </div>

      <div className='space-y-4'>
        {projects.map((project) => (
          <div key={project.name} className={`rounded-2xl px-6 py-4 ${cardBase}`}>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold'>{project.name}</h3>
                <div className='mt-1 flex flex-wrap items-center gap-4 text-xs opacity-80'>
                  <span className='flex items-center gap-1'>
                    <Globe className='h-3 w-3' />
                    {project.type}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='h-3 w-3' />
                    {project.members} members
                  </span>
                  <span className='flex items-center gap-1'>
                    <ClipboardList className='h-3 w-3' />
                    {project.worklists} worklists
                  </span>
                  <span className='flex items-center gap-1'>
                    <Bug className='h-3 w-3' />
                    {project.findings} findings
                  </span>
                </div>
              </div>
              <span className={`rounded-full px-4 py-1 text-xs font-semibold ${badgeClass(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
