import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'


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

function computeCVSS40Score(m: Record<string, string>): number {
  // Jika semua impact None → score 0
  if (m.VC === 'N' && m.VI === 'N' && m.VA === 'N' &&
      m.SC === 'N' && m.SI === 'N' && m.SA === 'N') return 0.0

  const eq1 = m.AV === 'N' && m.PR === 'N' && m.UI === 'N' ? 0
    : (m.AV === 'N' || m.PR === 'N' || m.UI === 'N') ? 1 : 2

  const eq2 = m.AC === 'L' && m.AT === 'N' ? 0 : 1

  const eq3 = m.VC === 'H' && m.VI === 'H' ? 0
    : (m.VC === 'H' || m.VI === 'H' || m.VA === 'H') ? 1 : 2

  const msi = m.MSI !== 'X' ? m.MSI : m.SI
  const msa = m.MSA !== 'X' ? m.MSA : m.SA
  const eq4 = msi === 'S' || msa === 'S' ? 0
    : (m.SC === 'H' || m.SI === 'H' || m.SA === 'H') ? 1 : 2

  const eq5 = (m.E === 'A' || m.E === 'X') ? 0 : m.E === 'P' ? 1 : 2

  const cr = m.CR === 'X' ? 'M' : m.CR
  const ir = m.IR === 'X' ? 'M' : m.IR
  const ar = m.AR === 'X' ? 'M' : m.AR
  const eq6 = (cr === 'H' && m.VC === 'H') || (ir === 'H' && m.VI === 'H') || (ar === 'H' && m.VA === 'H') ? 0 : 1

  // EQ3 + EQ6 digabung jadi 1 dimensi (0-3)
  const eq3_6 =
    eq3 === 0 && eq6 === 0 ? 0
    : (eq3 === 0 && eq6 === 1) || (eq3 === 1 && eq6 === 0) ? 1
    : (eq3 === 1 && eq6 === 1) || (eq3 === 2 && eq6 === 0) ? 2
    : 3

  const lookup: Record<string, number> = {
    // eq1=0, eq2=0
    '00000': 10.0, '00001': 9.9, '00002': 9.8,
    '00010': 9.9,  '00011': 9.7, '00012': 9.5,
    '00020': 9.5,  '00021': 9.3, '00022': 9.2,
    '00030': 9.3,  '00031': 9.0, '00032': 8.7,
    '00100': 9.8,  '00101': 9.5, '00102': 9.2,
    '00110': 9.5,  '00111': 9.2, '00112': 8.9,
    '00120': 9.0,  '00121': 8.7, '00122': 8.5,
    '00130': 8.7,  '00131': 8.4, '00132': 8.1,
    '00200': 9.3,  '00201': 9.0, '00202': 8.8,
    '00210': 9.0,  '00211': 8.7, '00212': 8.4,
    '00220': 8.5,  '00221': 8.1, '00222': 7.8,
    '00230': 8.1,  '00231': 7.7, '00232': 7.4,
    // eq1=0, eq2=1
    '01000': 9.8,  '01001': 9.5, '01002': 9.2,
    '01010': 9.5,  '01011': 9.2, '01012': 8.9,
    '01020': 9.0,  '01021': 8.4, '01022': 8.1,
    '01030': 8.1,  '01031': 7.5, '01032': 7.0,
    '01100': 9.3,  '01101': 9.0, '01102': 8.7,
    '01110': 9.0,  '01111': 8.7, '01112': 8.4,
    '01120': 8.4,  '01121': 7.9, '01122': 7.5,
    '01130': 7.9,  '01131': 7.4, '01132': 6.9,
    '01200': 8.8,  '01201': 8.5, '01202': 8.2,
    '01210': 8.5,  '01211': 8.2, '01212': 7.9,
    '01220': 7.9,  '01221': 7.4, '01222': 6.9,
    '01230': 7.4,  '01231': 6.9, '01232': 4.8,
    // eq1=1, eq2=0
    '10000': 9.5,  '10001': 9.1, '10002': 8.8,
    '10010': 9.0,  '10011': 8.3, '10012': 8.0,
    '10020': 7.7,  '10021': 6.7, '10022': 6.4,
    '10030': 7.0,  '10031': 6.2, '10032': 5.9,
    '10100': 9.0,  '10101': 8.5, '10102': 8.2,
    '10110': 8.5,  '10111': 8.0, '10112': 7.7,
    '10120': 7.5,  '10121': 6.5, '10122': 6.2,
    '10130': 6.5,  '10131': 5.8, '10132': 5.4,
    '10200': 8.2,  '10201': 7.8, '10202': 7.5,
    '10210': 7.8,  '10211': 7.4, '10212': 7.0,
    '10220': 6.8,  '10221': 5.9, '10222': 5.5,
    '10230': 6.0,  '10231': 5.2, '10232': 4.8,
    // eq1=1, eq2=1
    '11000': 9.0,  '11001': 8.5, '11002': 8.2,
    '11010': 7.7,  '11011': 7.5, '11012': 7.2,
    '11020': 6.2,  '11021': 5.5, '11022': 5.2,
    '11030': 5.5,  '11031': 4.8, '11032': 4.5,
    '11100': 8.5,  '11101': 8.0, '11102': 7.7,
    '11110': 7.5,  '11111': 7.0, '11112': 6.7,
    '11120': 5.9,  '11121': 5.2, '11122': 4.9,
    '11130': 5.2,  '11131': 4.6, '11132': 4.3,
    '11200': 7.9,  '11201': 7.5, '11202': 7.2,
    '11210': 7.0,  '11211': 6.5, '11212': 6.2,
    '11220': 5.4,  '11221': 4.8, '11222': 4.5,
    '11230': 4.8,  '11231': 4.2, '11232': 3.9,
    // eq1=2, eq2=0
    '20000': 9.3,  '20001': 8.7, '20002': 8.4,
    '20010': 8.6,  '20011': 7.9, '20012': 7.6,
    '20020': 6.9,  '20021': 5.9, '20022': 5.6,
    '20030': 6.0,  '20031': 5.3, '20032': 5.0,
    '20100': 8.7,  '20101': 8.2, '20102': 7.9,
    '20110': 8.0,  '20111': 7.5, '20112': 7.2,
    '20120': 6.5,  '20121': 5.6, '20122': 5.3,
    '20130': 5.6,  '20131': 4.9, '20132': 4.6,
    '20200': 8.0,  '20201': 7.5, '20202': 7.2,
    '20210': 7.4,  '20211': 6.8, '20212': 6.5,
    '20220': 5.9,  '20221': 5.1, '20222': 4.8,
    '20230': 5.1,  '20231': 4.5, '20232': 4.2,
    // eq1=2, eq2=1
    '21000': 8.3,  '21001': 7.4, '21002': 7.1,
    '21010': 7.2,  '21011': 6.4, '21012': 6.1,
    '21020': 5.4,  '21021': 4.8, '21022': 4.5,
    '21030': 4.5,  '21031': 4.0, '21032': 3.7,
    '21100': 7.8,  '21101': 7.0, '21102': 6.7,
    '21110': 6.8,  '21111': 6.1, '21112': 5.8,
    '21120': 5.1,  '21121': 4.5, '21122': 4.2,
    '21130': 4.2,  '21131': 3.7, '21132': 3.4,
    '21200': 7.0,  '21201': 6.4, '21202': 6.1,
    '21210': 6.2,  '21211': 5.6, '21212': 5.3,
    '21220': 4.7,  '21221': 4.1, '21222': 3.8,
    '21230': 4.0,  '21231': 3.5, '21232': 2.7,
  }

  const key = `${eq1}${eq2}${eq3_6}${eq4}${eq5}`
  return lookup[key] ?? 0.0
}


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
                  className={`min-w-[110px] rounded-full border px-5 py-2 text-sm font-semibold font-montserrat transition-all ${
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

  const score = computeCVSS40Score(selectedMetrics)

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

  const vectorString =
    `CVSS:4.0/AV:${selectedMetrics.AV}/AC:${selectedMetrics.AC}/AT:${selectedMetrics.AT}` +
    `/PR:${selectedMetrics.PR}/UI:${selectedMetrics.UI}` +
    `/VC:${selectedMetrics.VC}/VI:${selectedMetrics.VI}/VA:${selectedMetrics.VA}` +
    `/SC:${selectedMetrics.SC}/SI:${selectedMetrics.SI}/SA:${selectedMetrics.SA}` +
    `/E:${selectedMetrics.E}`

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
          Score and vector string based on selected metrics.
        </p>

        <div className='mt-8 text-center'>
          <h1 className={`text-6xl font-bold font-montserrat ${theme.title}`}>
            {score.toFixed(1)}
          </h1>
          <div className={`mt-4 inline-block px-8 py-2 rounded-full font-semibold font-montserrat ${severityColor}`}>
            {severity}
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
