import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { CVSS40 } from '@pandatix/js-cvss'


const exploitabilityMetrics = [
  {
    key: 'AV',
    title: 'Attack Vector (AV)',
    options: [
      { label: 'Network (N)', value: 'N' },
      { label: 'Adjacent (A)', value: 'A' },
      { label: 'Local (L)', value: 'L' },
      { label: 'Physical (P)', value: 'P' }
    ]
  },
  {
    key: 'AC',
    title: 'Attack Complexity (AC)',
    options: [
      { label: 'Low (L)', value: 'L' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'AT',
    title: 'Attack Requirements (AT)',
    options: [
      { label: 'None (N)', value: 'N' },
      { label: 'Present (P)', value: 'P' }
    ]
  },
  {
    key: 'PR',
    title: 'Privileges Required (PR)',
    options: [
      { label: 'None (N)', value: 'N' },
      { label: 'Low (L)', value: 'L' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'UI',
    title: 'User Interaction (UI)',
    options: [
      { label: 'None (N)', value: 'N' },
      { label: 'Passive (P)', value: 'P' },
      { label: 'Active (A)', value: 'A' }
    ]
  }
]

const vulnerableSystemMetrics = [
  {
    key: 'VC',
    title: 'Confidentiality (VC)',
    options: [
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'VI',
    title: 'Integrity (VI)',
    options: [
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'VA',
    title: 'Availability (VA)',
    options: [
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  }
]

const subsequentSystemMetrics = [
  {
    key: 'SC',
    title: 'Confidentiality (SC)',
    options: [
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'SI',
    title: 'Integrity (SI)',
    options: [
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'SA',
    title: 'Availability (SA)',
    options: [
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  }
]

const threatMetrics = [
  {
    key: 'E',
    title: 'Exploit Maturity (E)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Attacked (A)', value: 'A' },
      { label: 'POC (P)', value: 'P' },
      { label: 'Unreported (U)', value: 'U' }
    ]
  }
]

const environmentalMetrics = [
  {
    key: 'CR',
    title: 'Confidentiality Requirement (CR)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'High (H)', value: 'H' },
      { label: 'Medium (M)', value: 'M' },
      { label: 'Low (L)', value: 'L' }
    ]
  },
  {
    key: 'IR',
    title: 'Integrity Requirement (IR)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'High (H)', value: 'H' },
      { label: 'Medium (M)', value: 'M' },
      { label: 'Low (L)', value: 'L' }
    ]
  },
  {
    key: 'AR',
    title: 'Availability Requirement (AR)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'High (H)', value: 'H' },
      { label: 'Medium (M)', value: 'M' },
      { label: 'Low (L)', value: 'L' }
    ]
  },
  {
    key: 'MAV',
    title: 'Modified Attack Vector (MAV)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Network (N)', value: 'N' },
      { label: 'Adjacent (A)', value: 'A' },
      { label: 'Local (L)', value: 'L' },
      { label: 'Physical (P)', value: 'P' }
    ]
  },
  {
    key: 'MAC',
    title: 'Modified Attack Complexity (MAC)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Low (L)', value: 'L' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'MAT',
    title: 'Modified Attack Requirements (MAT)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'None (N)', value: 'N' },
      { label: 'Present (P)', value: 'P' }
    ]
  },
  {
    key: 'MPR',
    title: 'Modified Privileges Required (MPR)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'None (N)', value: 'N' },
      { label: 'Low (L)', value: 'L' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'MUI',
    title: 'Modified User Interaction (MUI)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'None (N)', value: 'N' },
      { label: 'Passive (P)', value: 'P' },
      { label: 'Active (A)', value: 'A' }
    ]
  },
  {
    key: 'MVC',
    title: 'Modified Vulnerable Confidentiality (MVC)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'MVI',
    title: 'Modified Vulnerable Integrity (MVI)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'MVA',
    title: 'Modified Vulnerable Availability (MVA)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'MSC',
    title: 'Modified Subsequent Confidentiality (MSC)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'MSI',
    title: 'Modified Subsequent Integrity (MSI)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Safety (S)', value: 'S' },
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  },
  {
    key: 'MSA',
    title: 'Modified Subsequent Availability (MSA)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Safety (S)', value: 'S' },
      { label: 'High (H)', value: 'H' },
      { label: 'Low (L)', value: 'L' },
      { label: 'None (N)', value: 'N' }
    ]
  }
]

const supplementalMetrics = [
  {
    key: 'S',
    title: 'Safety (S)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Negligible (N)', value: 'N' },
      { label: 'Present (P)', value: 'P' }
    ]
  },
  {
    key: 'AU',
    title: 'Automatable (AU)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'No (N)', value: 'N' },
      { label: 'Yes (Y)', value: 'Y' }
    ]
  },
  {
    key: 'R',
    title: 'Recovery (R)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Automatic (A)', value: 'A' },
      { label: 'User (U)', value: 'U' },
      { label: 'Irrecoverable (I)', value: 'I' }
    ]
  },
  {
    key: 'V',
    title: 'Value Density (V)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Diffuse (D)', value: 'D' },
      { label: 'Concentrated (C)', value: 'C' }
    ]
  },
  {
    key: 'RE',
    title: 'Vulnerability Response Effort (RE)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Low (L)', value: 'L' },
      { label: 'Moderate (M)', value: 'M' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'U',
    title: 'Provider Urgency (U)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Clear (C)', value: 'C' },
      { label: 'Green (G)', value: 'G' },
      { label: 'Amber (A)', value: 'A' },
      { label: 'Red (R)', value: 'R' }
    ]
  }
]

// ─── CVSS 4.0 Scoring ─────────────────────────────────────────────────────────
// We use @pandatix/js-cvss which implements the exact CVSS 4.0 algorithm including MacroVector interpolation.


// ─── MetricSection Component ───────────────────────────────────────────────────

function MetricSection({
  title,
  description,
  groups,
  selectedMetrics,
  onSelect,
  theme
}: {
  title: string
  description: string
  groups: { key: string; title: string; options: { label: string; value: string }[] }[]
  selectedMetrics: Record<string, string>
  onSelect: (key: string, value: string) => void
  theme: { title: string; description: string; cardBase: string }
}) {
  return (
    <div className={`px-8 py-8 lg:px-10 ${theme.cardBase}`}>
      <h2 className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold ${theme.title}`}>
        {title}
      </h2>
      <p className={`mt-2 text-sm md:text-md font-medium font-montserrat opacity-80 ${theme.description}`}>
        {description}
      </p>
      <div className='mt-6'>
        {groups.map((metric) => (
          <div key={metric.key} className='mb-6'>
            <h3 className={`mb-3 text-sm md:text-md font-semibold font-montserrat ${theme.title}`}>
              {metric.title}
            </h3>
            <div className='flex flex-wrap gap-3'>
              {metric.options.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => onSelect(metric.key, option.value)}
                  className={`min-w-27.5 rounded-full border px-5 py-2 text-sm font-semibold font-montserrat transition-all ${
                    selectedMetrics[metric.key] === option.value
                      ? 'border-transparent bg-[#1767AA] text-white shadow-[0_4px_10px_rgba(23,103,170,0.25)]'
                      : 'border-[#B9DDF7] text-[#1767AA] hover:bg-[#DFF5FB]'
                  }`}
                >
                  {option.label}
                </button> 
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

function CVSSCalculator() {
  const { isDark } = useOutletContext<LayoutContext>()

  const [selectedMetrics, setSelectedMetrics] = useState<Record<string, string>>({
    AV: 'N', AC: 'L', AT: 'N', PR: 'N', UI: 'N',
    VC: 'N', VI: 'N', VA: 'N',
    SC: 'N', SI: 'N', SA: 'N',
    E: 'X',
    CR: 'X', IR: 'X', AR: 'X',
    MAV: 'X', MAC: 'X', MAT: 'X', MPR: 'X', MUI: 'X',
    MVC: 'X', MVI: 'X', MVA: 'X',
    MSC: 'X', MSI: 'X', MSA: 'X',
    S: 'X', AU: 'X', R: 'X', V: 'X', RE: 'X', U: 'X'
  })

  const handleSelect = (key: string, value: string) =>
    setSelectedMetrics((prev) => ({ ...prev, [key]: value }))

  let vectorString = `CVSS:4.0/AV:${selectedMetrics.AV}/AC:${selectedMetrics.AC}/AT:${selectedMetrics.AT}` +
    `/PR:${selectedMetrics.PR}/UI:${selectedMetrics.UI}` +
    `/VC:${selectedMetrics.VC}/VI:${selectedMetrics.VI}/VA:${selectedMetrics.VA}` +
    `/SC:${selectedMetrics.SC}/SI:${selectedMetrics.SI}/SA:${selectedMetrics.SA}`
  
  const optionalKeys = ['E', 'CR', 'IR', 'AR', 'MAV', 'MAC', 'MAT', 'MPR', 'MUI', 'MVC', 'MVI', 'MVA', 'MSC', 'MSI', 'MSA', 'S', 'AU', 'R', 'V', 'RE']
  const optionalVector = optionalKeys.filter(k => selectedMetrics[k] && selectedMetrics[k] !== 'X').map(k => `/${k}:${selectedMetrics[k]}`).join('')
  
  vectorString += optionalVector
  
  if (selectedMetrics.U && selectedMetrics.U !== 'X') {
    const uMap: Record<string, string> = { C: 'Clear', G: 'Green', A: 'Amber', R: 'Red' }
    vectorString += `/U:${uMap[selectedMetrics.U]}`
  }

  let score = 0
  try {
    score = new CVSS40(vectorString).Score()
  } catch (e) {
    console.error("Invalid CVSS vector string", e)
  }

  const severity =
    score === 0 ? 'None'
    : score < 4 ? 'Low'
    : score < 7 ? 'Medium'
    : score < 9 ? 'High'
    : 'Critical'

  const severityColor =
    severity === 'None' ? 'bg-gray-200 text-gray-700'
    : severity === 'Low' ? 'bg-[#005B35] text-[#17E58F]'
    : severity === 'Medium' ? 'bg-[#5B4100] text-[#E6DF14]'
    : severity === 'High' ? 'bg-[#5B3100] text-[#E67219]'
    : 'bg-[#5B0000] text-[#EC2828]'



  const [copied, setCopied] = useState(false)

  const copyVector = () => {
    navigator.clipboard.writeText(vectorString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const theme = isDark
    ? {
        title: 'text-[#FFFFFF]',
        description: 'text-[#41B0EC]',
        cardBase:
          'rounded-3xl xl:rounded-4xl bg-gradient-to-br from-[#F5F5F5]/15 to-[#C2C2C2]/8 border border-[#F5F5F5]/40 text-[#F5F5F5] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]'
      }
    : {
        title: 'text-[#002C49]',
        description: 'text-[#0E65AD]',
        cardBase:
          'rounded-3xl xl:rounded-4xl bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border border-[#27D6FF]/40 text-[#002C49] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]'
      }

  const getVal = (v: string, map: Record<string, number>) => map[v] ?? 0
  const chartData = [
    { metric: 'AV', full: 'Attack Vector', value: getVal(selectedMetrics.AV, { P: 0, L: 33, A: 66, N: 100 }) },
    { metric: 'AC', full: 'Attack Complexity', value: getVal(selectedMetrics.AC, { L: 0, H: 100 }) },
    { metric: 'AT', full: 'Attack Requirements', value: getVal(selectedMetrics.AT, { N: 0, P: 100 }) },
    { metric: 'PR', full: 'Privileges Required', value: getVal(selectedMetrics.PR, { N: 0, L: 50, H: 100 }) },
    { metric: 'UI', full: 'User Interaction', value: getVal(selectedMetrics.UI, { N: 0, P: 50, A: 100 }) },
    { metric: 'VC', full: 'Vuln. Confidentiality', value: getVal(selectedMetrics.VC, { N: 0, L: 50, H: 100 }) },
    { metric: 'VI', full: 'Vuln. Integrity', value: getVal(selectedMetrics.VI, { N: 0, L: 50, H: 100 }) },
    { metric: 'VA', full: 'Vuln. Availability', value: getVal(selectedMetrics.VA, { N: 0, L: 50, H: 100 }) },
    { metric: 'SC', full: 'Subseq. Confidentiality', value: getVal(selectedMetrics.SC, { N: 0, L: 50, H: 100 }) },
    { metric: 'SI', full: 'Subseq. Integrity', value: getVal(selectedMetrics.SI, { N: 0, L: 50, H: 100 }) },
    { metric: 'SA', full: 'Subseq. Availability', value: getVal(selectedMetrics.SA, { N: 0, L: 50, H: 100 }) },
  ]

  return (
    <div className='space-y-6'>
      <header className='flex flex-col gap-1'>
        <h1 className={`text-2xl xl:text-3xl font-semibold font-montserrat ${theme.title}`}>
          CVSS Calculator
        </h1>
        <p className={`text-sm md:text-md xl:text-lg opacity-80 font-montserrat ${theme.description}`}>
          Calculate vulnerability severity scores based on CVSS 4.0 metrics.
        </p>
      </header>

      {/* Score Summary */}
      <div className={`px-8 py-8 lg:px-10 ${theme.cardBase}`}>
        <h2 className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold ${theme.title}`}>
          CVSS v4.0 Score Summary
        </h2>
        <p className={`mt-2 text-sm md:text-md font-medium font-montserrat opacity-80 ${theme.description}`}>
          Score, vector string, and metric visualization.
        </p>

        <div className='flex flex-col lg:flex-row items-center justify-between gap-10 mt-8'>
            <div className='flex-1 text-center lg:text-left'>
              <h1 className={`text-7xl lg:text-8xl font-bold font-montserrat ${theme.title}`}>
                {score.toFixed(1)}
              </h1>
              <div className={`mt-6 inline-block px-8 py-2 rounded-full text-lg font-semibold font-montserrat ${severityColor}`}>
                {severity}
              </div>
            </div>
            
            <div className='w-full lg:w-1/2 h-72 lg:h-80'>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke={isDark ? '#2BA7D640' : '#1767AA40'} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: isDark ? '#41B0EC' : '#1767AA', fontSize: 12, fontWeight: 600, fontFamily: 'Montserrat' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? '#002C49' : '#FFFFFF', borderColor: isDark ? '#41B0EC' : '#1767AA', borderRadius: '12px' }}
                    itemStyle={{ color: isDark ? '#F5F5F5' : '#002C49', fontWeight: 600, fontFamily: 'Montserrat' }}
                    formatter={(val, _name, props) => [`Severity Score: ${val}%`, props.payload.full]}
                  />
                  <Radar name="CVSS Metric" dataKey="value" stroke={isDark ? '#41B0EC' : '#1767AA'} fill={isDark ? '#41B0EC' : '#1767AA'} fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
        </div>

        <div className='mt-8 border-t border-[#B8DDF7] pt-6 flex items-center justify-between gap-4 flex-wrap'>
          <div className='flex-1 min-w-0 rounded-lg border border-[#B8DDF7] bg-[#EEF8FC] px-4 py-2 text-md text-[#1767AA] font-medium font-montserrat break-all'>
            {vectorString}
          </div>
          <button
            onClick={copyVector}
            className={`px-8 py-2 rounded-xl font-semibold font-montserrat transition-all ${
            copied
              ? 'bg-[#66C0EF] text-white opacity-70'
              : 'text-white bg-gradient-to-r from-[#356CB9] via-[#4D95DA] to-[#66C0EF] shadow-[0_4px_10px_rgba(77,149,218,0.35)] hover:brightness-105'
          }`}
        >
          {copied ? 'Copied!' : 'Copy Vector'}
        </button>
        </div>
      </div>

      <MetricSection
        title='Base Metrics: Exploitability Metrics'
        description='Characteristics of the vulnerability itself.'
        groups={exploitabilityMetrics}
        selectedMetrics={selectedMetrics}
        onSelect={handleSelect}
        theme={theme}
      />

      <MetricSection
        title='Base Metrics: Vulnerable System Impact'
        description='Impact on the system that contains the vulnerability.'
        groups={vulnerableSystemMetrics}
        selectedMetrics={selectedMetrics}
        onSelect={handleSelect}
        theme={theme}
      />

      <MetricSection
        title='Base Metrics: Subsequent System Impact'
        description='Impact on systems beyond the vulnerable component.'
        groups={subsequentSystemMetrics}
        selectedMetrics={selectedMetrics}
        onSelect={handleSelect}
        theme={theme}
      />

      <MetricSection
        title='Threat Metrics'
        description='Current state of exploit techniques or code availability.'
        groups={threatMetrics}
        selectedMetrics={selectedMetrics}
        onSelect={handleSelect}
        theme={theme}
      />

      <MetricSection
        title='Environmental Metrics'
        description='Customize the score based on your environment.'
        groups={environmentalMetrics}
        selectedMetrics={selectedMetrics}
        onSelect={handleSelect}
        theme={theme}
      />

      <MetricSection
        title='Supplemental Metrics'
        description='Additional context — does not affect the score.'
        groups={supplementalMetrics}
        selectedMetrics={selectedMetrics}
        onSelect={handleSelect}
        theme={theme}
      />
    </div>
  )
}

export default CVSSCalculator
