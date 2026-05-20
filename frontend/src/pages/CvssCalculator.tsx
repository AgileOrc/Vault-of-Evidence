import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { LayoutContext } from '../components/AppLayout'

type Option = { label: string; value: string }

type MetricGroup = {
  title: string
  subtitle?: string
  groups: { label: string; key: string; options: Option[] }[]
}

const baseMetrics: MetricGroup = {
  title: 'Base Score Calculator (CVSS v3.1)',
  groups: [
    {
      label: 'Attack Vector (AV)',
      key: 'AV',
      options: [
        { label: 'Network (N)', value: 'N' },
        { label: 'Adjacent (A)', value: 'A' },
        { label: 'Local (L)', value: 'L' },
        { label: 'Physical (P)', value: 'P' }
      ]
    },
    {
      label: 'Attack Complexity (AC)',
      key: 'AC',
      options: [
        { label: 'Low (L)', value: 'L' },
        { label: 'High (H)', value: 'H' }
      ]
    },
    {
      label: 'Privileges Required (PR)',
      key: 'PR',
      options: [
        { label: 'None (N)', value: 'N' },
        { label: 'Low (L)', value: 'L' },
        { label: 'High (H)', value: 'H' }
      ]
    },
    {
      label: 'User Interaction (UI)',
      key: 'UI',
      options: [
        { label: 'None (N)', value: 'N' },
        { label: 'Required (R)', value: 'R' }
      ]
    },
    {
      label: 'Scope (S)',
      key: 'S',
      options: [
        { label: 'Unchanged (U)', value: 'U' },
        { label: 'Changed (C)', value: 'C' }
      ]
    },
    {
      label: 'Confidentiality (C)',
      key: 'C',
      options: [
        { label: 'None (N)', value: 'N' },
        { label: 'Low (L)', value: 'L' },
        { label: 'High (H)', value: 'H' }
      ]
    },
    {
      label: 'Integrity (I)',
      key: 'I',
      options: [
        { label: 'None (N)', value: 'N' },
        { label: 'Low (L)', value: 'L' },
        { label: 'High (H)', value: 'H' }
      ]
    },
    {
      label: 'Availability (A)',
      key: 'A',
      options: [
        { label: 'None (N)', value: 'N' },
        { label: 'Low (L)', value: 'L' },
        { label: 'High (H)', value: 'H' }
      ]
    }
  ]
}

const temporalMetrics: MetricGroup = {
  title: 'Temporal Score',
  groups: [
    {
      label: 'Exploit Code Maturity (E)',
      key: 'E',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Unproven (U)', value: 'U' },
        { label: 'Proof-of-Concept (P)', value: 'P' },
        { label: 'Functional (F)', value: 'F' },
        { label: 'High (H)', value: 'H' }
      ]
    },
    {
      label: 'Remediation Level (RL)',
      key: 'RL',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Official Fix (O)', value: 'O' },
        { label: 'Temporary Fix (T)', value: 'T' },
        { label: 'Workaround (W)', value: 'W' },
        { label: 'Unavailable (U)', value: 'U' }
      ]
    },
    {
      label: 'Report Confidence (RC)',
      key: 'RC',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Unknown (U)', value: 'U' },
        { label: 'Reasonable (R)', value: 'R' },
        { label: 'Confirmed (C)', value: 'C' }
      ]
    }
  ]
}

const environmentalMetrics: MetricGroup = {
  title: 'Environmental Score',
  groups: [
    {
      label: 'Confidentiality Requirement (CR)',
      key: 'CR',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Low (L)', value: 'L' },
        { label: 'Medium (M)', value: 'M' },
        { label: 'High (H)', value: 'H' }
      ]
    },
    {
      label: 'Integrity Requirement (IR)',
      key: 'IR',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Low (L)', value: 'L' },
        { label: 'Medium (M)', value: 'M' },
        { label: 'High (H)', value: 'H' }
      ]
    },
    {
      label: 'Availability Requirement (AR)',
      key: 'AR',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Low (L)', value: 'L' },
        { label: 'Medium (M)', value: 'M' },
        { label: 'High (H)', value: 'H' }
      ]
    },
    {
      label: 'Modified Attack Vector (MAV)',
      key: 'MAV',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Network', value: 'N' },
        { label: 'Adjacent Network', value: 'A' },
        { label: 'Local', value: 'L' },
        { label: 'Physical', value: 'P' }
      ]
    },
    {
      label: 'Modified Attack Complexity (MAC)',
      key: 'MAC',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Low', value: 'L' },
        { label: 'High', value: 'H' }
      ]
    },
    {
      label: 'Modified Privileges Required (MPR)',
      key: 'MPR',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'None', value: 'N' },
        { label: 'Low', value: 'L' },
        { label: 'High', value: 'H' }
      ]
    },
    {
      label: 'Modified User Interaction (MUI)',
      key: 'MUI',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'None', value: 'N' },
        { label: 'Required', value: 'R' }
      ]
    },
    {
      label: 'Modified Scope (MS)',
      key: 'MS',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'Unchanged', value: 'U' },
        { label: 'Changed', value: 'C' }
      ]
    },
    {
      label: 'Modified Confidentiality (MC)',
      key: 'MC',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'None', value: 'N' },
        { label: 'Low', value: 'L' },
        { label: 'High', value: 'H' }
      ]
    },
    {
      label: 'Modified Integrity (MI)',
      key: 'MI',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'None', value: 'N' },
        { label: 'Low', value: 'L' },
        { label: 'High', value: 'H' }
      ]
    },
    {
      label: 'Modified Availability (MA)',
      key: 'MA',
      options: [
        { label: 'Not Defined (X)', value: 'X' },
        { label: 'None', value: 'N' },
        { label: 'Low', value: 'L' },
        { label: 'High', value: 'H' }
      ]
    }
  ]
}

function CvssCalculator () {
  const { isDark } = useOutletContext<LayoutContext>()
  const [selected, setSelected] = useState<Record<string, string>>({
    AV: 'N',
    AC: 'L',
    PR: 'N',
    UI: 'N',
    S: 'U',
    C: 'N',
    I: 'N',
    A: 'N',
    E: 'X',
    RL: 'X',
    RC: 'X',
    CR: 'X',
    IR: 'X',
    AR: 'X',
    MAV: 'X',
    MAC: 'X',
    MPR: 'X',
    MUI: 'X',
    MS: 'X',
    MC: 'X',
    MI: 'X',
    MA: 'X'
  })

  const sectionBase = isDark
    ? 'bg-[#1767AA] border border-[#27D6FF]/20 text-[#F5F5F5]'
    : 'bg-[#F5F5F5] border border-[#27D6FF]/40 text-[#002C49]'

  const optionBase = isDark
    ? 'border-[#27D6FF]/30 text-[#F5F5F5]'
    : 'border-[#27D6FF]/40 text-[#1767AA]'

  const optionActive = isDark
    ? 'bg-[#27D6FF] text-[#002C49]'
    : 'bg-[#20A6DA] text-[#002C49]'

  const renderGroup = (group: MetricGroup) => (
    <section className={`rounded-2xl p-6 ${sectionBase}`}>
      <h2 className='text-lg font-semibold'>{group.title}</h2>
      <div className='mt-5 space-y-5'>
        {group.groups.map((metric) => (
          <div key={metric.key}>
            <p className='text-sm font-semibold'>{metric.label}</p>
            <div className='mt-2 flex flex-wrap gap-3'>
              {metric.options.map((option) => {
                const isActive = selected[metric.key] === option.value
                return (
                  <button
                    key={option.label}
                    type='button'
                    onClick={() => setSelected((prev) => ({ ...prev, [metric.key]: option.value }))}
                    className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
                      isActive ? optionActive : optionBase
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div className='space-y-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-semibold'>CVSS Calculator</h1>
          <p className='mt-1 text-sm opacity-80'>Enter base, temporal, and environmental metrics to calculate the vulnerability score.</p>
        </div>
        <button
          type='button'
          className='flex items-center gap-2 rounded-lg bg-[#27D6FF] px-4 py-2 text-sm font-semibold text-[#002C49]'
        >
          <Plus className='h-4 w-4' />
          New Project
        </button>
      </header>

      {renderGroup(baseMetrics)}
      {renderGroup(temporalMetrics)}
      {renderGroup(environmentalMetrics)}

      <section className={`rounded-2xl p-6 text-center ${sectionBase}`}>
        <h3 className='text-lg font-semibold'>Your CVSS v3.1 Score Summary</h3>
        <div className='mt-4 text-4xl font-semibold'>8.0</div>
        <div className='mx-auto mt-2 w-fit rounded-full bg-[#1767AA] px-6 py-1 text-sm font-semibold text-[#F5F5F5]'>
          High
        </div>
        <div className='mt-6 grid gap-4 text-sm md:grid-cols-3'>
          <div>
            <p className='opacity-80'>Base Score</p>
            <p className='text-lg font-semibold'>8.0</p>
          </div>
          <div>
            <p className='opacity-80'>Temporal Score</p>
            <p className='text-lg font-semibold'>N/A</p>
          </div>
          <div>
            <p className='opacity-80'>Environmental Score</p>
            <p className='text-lg font-semibold'>N/A</p>
          </div>
        </div>
        <div className='mt-6 flex flex-wrap items-center justify-center gap-4'>
          <span className={`rounded-full px-4 py-2 text-xs ${optionBase}`}>
            CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N
          </span>
          <button
            type='button'
            className='rounded-lg bg-[#27D6FF] px-4 py-2 text-xs font-semibold text-[#002C49]'
          >
            Copy Vector
          </button>
        </div>
      </section>
    </div>
  )
}

export default CvssCalculator
