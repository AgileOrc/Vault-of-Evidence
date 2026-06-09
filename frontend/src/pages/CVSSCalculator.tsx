import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { LayoutContext } from '../components/AppLayout'

const baseMetricGroups = [
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
      { label: 'Required (R)', value: 'R' }
    ]
  },
  {
    key: 'S',
    title: 'Scope (S)',
    options: [
      { label: 'Unchanged (U)', value: 'U' },
      { label: 'Changed (C)', value: 'C' }
    ]
  },
  {
    key: 'C',
    title: 'Confidentiality (C)',
    options: [
      { label: 'None (N)', value: 'N' },
      { label: 'Low (L)', value: 'L' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'I',
    title: 'Integrity (I)',
    options: [
      { label: 'None (N)', value: 'N' },
      { label: 'Low (L)', value: 'L' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'A',
    title: 'Availability (A)',
    options: [
      { label: 'None (N)', value: 'N' },
      { label: 'Low (L)', value: 'L' },
      { label: 'High (H)', value: 'H' }
    ]
  }
]

const temporalMetricGroups = [
  {
    key: 'E',
    title: 'Exploit Code Maturity (E)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Unproven (U)', value: 'U' },
      { label: 'Proof-of-Concept (P)', value: 'P' },
      { label: 'Functional (F)', value: 'F' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'RL',
    title: 'Remediation Level (RL)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Official Fix (O)', value: 'O' },
      { label: 'Temporary Fix (T)', value: 'T' },
      { label: 'Workaround (W)', value: 'W' },
      { label: 'Unavailable (U)', value: 'U' }
    ]
  },
  {
    key: 'RC',
    title: 'Report Confidence (RC)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Unknown (U)', value: 'U' },
      { label: 'Reasonable (R)', value: 'R' },
      { label: 'Confirmed (C)', value: 'C' }
    ]
  }
]

const environmentalMetricGroups = [
  {
    key: 'CR',
    title: 'Confidentiality Requirement (CR)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Low (L)', value: 'L' },
      { label: 'Medium (M)', value: 'M' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'IR',
    title: 'Integrity Requirement (IR)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Low (L)', value: 'L' },
      { label: 'Medium (M)', value: 'M' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'AR',
    title: 'Availability Requirement (AR)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Low (L)', value: 'L' },
      { label: 'Medium (M)', value: 'M' },
      { label: 'High (H)', value: 'H' }
    ]
  },
  {
    key: 'MAV',
    title: 'Modified Attack Vector (MAV)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Network', value: 'N' },
      { label: 'Adjacent Network', value: 'A' },
      { label: 'Local', value: 'L' },
      { label: 'Physical', value: 'P' }
    ]
  },
  {
    key: 'MAC',
    title: 'Modified Attack Complexity (MAC)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Low', value: 'L' },
      { label: 'High', value: 'H' }
    ]
  },
  {
    key: 'MPR',
    title: 'Modified Privileges Required (MPR)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'None', value: 'N' },
      { label: 'Low', value: 'L' },
      { label: 'High', value: 'H' }
    ]
  },
  {
    key: 'MUI',
    title: 'Modified User Interaction (MUI)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'None', value: 'N' },
      { label: 'Required', value: 'R' }
    ]
  },
  {
    key: 'MS',
    title: 'Modified Scope (MS)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'Unchanged', value: 'U' },
      { label: 'Changed', value: 'C' }
    ]
  },
  {
    key: 'MC',
    title: 'Modified Confidentiality (MC)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'None', value: 'N' },
      { label: 'Low', value: 'L' },
      { label: 'High', value: 'H' }
    ]
  },
  {
    key: 'MI',
    title: 'Modified Integrity (MI)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'None', value: 'N' },
      { label: 'Low', value: 'L' },
      { label: 'High', value: 'H' }
    ]
  },
  {
    key: 'MA',
    title: 'Modified Availability (MA)',
    options: [
      { label: 'Not Defined (X)', value: 'X' },
      { label: 'None', value: 'N' },
      { label: 'Low', value: 'L' },
      { label: 'High', value: 'H' }
    ]
  }
]


function CVSSCalculator() {
  const { isDark } = useOutletContext<LayoutContext>()
  const [selectedMetrics, setSelectedMetrics] = useState<Record<string, string>>({
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

 const vectorString = `CVSS:3.1/AV:${selectedMetrics.AV}/AC:${selectedMetrics.AC}/PR:${selectedMetrics.PR}/UI:${selectedMetrics.UI}/S:${selectedMetrics.S}/C:${selectedMetrics.C}/I:${selectedMetrics.I}/A:${selectedMetrics.A}` 
 const copyVector = () => {
    navigator.clipboard.writeText(vectorString)
}

const metricWeights: Record<string, Record<string, number>> = {
  AV: { N: 0.85, A: 0.62, L: 0.55, P: 0.2 },
  AC: { L: 0.77, H: 0.44 },
  PR_U: { N: 0.85, L: 0.62, H: 0.27 },
  PR_C: { N: 0.85, L: 0.68, H: 0.5 },
  UI: { N: 0.85, R: 0.62 },
  C: { H: 0.56, L: 0.22, N: 0 },
  I: { H: 0.56, L: 0.22, N: 0 },
  A: { H: 0.56, L: 0.22, N: 0 }
}

const roundUp1 = (num: number) => Math.ceil(num * 10) / 10

const impactSubScore =
  1 -
  (1 - metricWeights.C[selectedMetrics.C]) *
    (1 - metricWeights.I[selectedMetrics.I]) *
    (1 - metricWeights.A[selectedMetrics.A])

const impact =
  selectedMetrics.S === 'U'
    ? 6.42 * impactSubScore
    : 7.52 * (impactSubScore - 0.029) - 3.25 * Math.pow(impactSubScore - 0.02, 15)

const exploitability =
  8.22 *
  metricWeights.AV[selectedMetrics.AV] *
  metricWeights.AC[selectedMetrics.AC] *
  metricWeights[selectedMetrics.S === 'U' ? 'PR_U' : 'PR_C'][selectedMetrics.PR] *
  metricWeights.UI[selectedMetrics.UI]

const baseScore =
  impact <= 0
    ? 0
    : selectedMetrics.S === 'U'
      ? roundUp1(Math.min(impact + exploitability, 10))
      : roundUp1(Math.min(1.08 * (impact + exploitability), 10))

const severity =
  baseScore === 0
    ? 'None'
    : baseScore < 4
      ? 'Low'
      : baseScore < 7
        ? 'Medium'
        : baseScore < 9
          ? 'High'
          : 'Critical'

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
  <div className='space-y-8 md:space-y-12 xl:space-y-6'>
    <header className='flex flex-col gap-1'>
      <h1 className={`text-2xl xl:text-3xl font-semibold font-montserrat ${theme.title}`}>
        CVSS Calculator
      </h1>
      <p className={`text-sm md:text-md xl:text-lg opacity-80 font-montserrat ${theme.description}`}>
        Calculate vulnerability severity scores based on CVSS metrics.
      </p>
    </header>

    <div className={`px-8 py-8 lg:px-10 ${theme.cardBase}`}>
      <h2 className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold ${theme.title}`}>
        Base Score Metrics
      </h2>
      <p className={`mt-2 text-sm md:text-md font-medium font-montserrat opacity-80 ${theme.description}`}>
        Select each metric to generate the CVSS score.
      </p>
        <div className='mt-6'>
    {baseMetricGroups.map((metric) => (
        <div key={metric.key} className='mb-6'>
        <h3 className='mb-3 font-semibold'>
            {metric.title}
        </h3>
        <div className='flex flex-wrap gap-4'>
        {metric.options.map((option) => (
            <button
            key={option.value}
            type='button'
            onClick={() =>
                setSelectedMetrics((prev) => ({
                ...prev,
                [metric.key]: option.value
                }))
            }
            className={`min-w-[110px] rounded-full border px-5 py-2 text-sm font-semibold font-montserrat transition-all ${
                selectedMetrics[metric.key] === option.value
                ? 'border-transparent bg-linear-to-r from-[#1767AA] to-[#41B0EC] text-white shadow-[0_4px_10px_rgba(23,103,170,0.25)]'
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

    <div className={`px-8 py-8 lg:px-10 ${theme.cardBase}`}>
    <h2 className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold ${theme.title}`}>
        Temporal Score
    </h2>
    <p className={`mt-2 text-sm md:text-md font-medium font-montserrat opacity-80 ${theme.description}`}>
        Adjust the score based on exploit maturity, remediation level, and confidence.
    </p>

    <div className='mt-6'>
        {temporalMetricGroups.map((metric) => (
        <div key={metric.key} className='mb-6'>
            <h3 className={`mb-3 text-sm md:text-md font-semibold font-montserrat ${theme.title}`}>
            {metric.title}
            </h3>

            <div className='flex flex-wrap gap-4'>
            {metric.options.map((option) => (
                <button
                key={option.value}
                type='button'
                onClick={() =>
                    setSelectedMetrics((prev) => ({
                    ...prev,
                    [metric.key]: option.value
                    }))
                }
                className={`min-w-[110px] rounded-full border px-5 py-2 text-sm font-semibold font-montserrat transition-all ${
                    selectedMetrics[metric.key] === option.value
                    ? 'border-transparent bg-linear-to-r from-[#1767AA] to-[#41B0EC] text-white shadow-[0_4px_10px_rgba(23,103,170,0.25)]'
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

    <div className={`px-8 py-8 lg:px-10 ${theme.cardBase}`}>
      <h2 className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold ${theme.title}`}>
        Environmental Score
      </h2>
      <p className={`mt-2 text-sm md:text-md font-medium font-montserrat opacity-80 ${theme.description}`}>
        Customize the score based on the environment and modified metrics.
      </p>
      <div className='mt-6'>
        {environmentalMetricGroups.map((metric) => (
            <div key={metric.key} className='mb-6'>
            <h3 className={`mb-3 text-sm md:text-md font-semibold font-montserrat ${theme.title}`}>
                {metric.title}
            </h3>

            <div className='flex flex-wrap gap-4'>
                {metric.options.map((option) => (
                <button
                    key={option.value}
                    type='button'
                    onClick={() =>
                    setSelectedMetrics((prev) => ({
                        ...prev,
                        [metric.key]: option.value
                    }))
                    }
                    className={`min-w-[110px] rounded-full border px-5 py-2 text-sm font-semibold font-montserrat transition-all ${
                    selectedMetrics[metric.key] === option.value
                        ? 'border-transparent bg-linear-to-r from-[#1767AA] to-[#41B0EC] text-white shadow-[0_4px_10px_rgba(23,103,170,0.25)]'
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

    <div className={`px-8 py-8 lg:px-10 ${theme.cardBase}`}>
  <h2
    className={`text-lg md:text-xl xl:text-2xl font-montserrat font-semibold ${theme.title}`}
  >
    Your CVSS v3.1 Score Summary
  </h2>

  <p
    className={`mt-2 text-sm md:text-md font-medium font-montserrat opacity-80 ${theme.description}`}
  >
    Base Score, Temporal Score, Environmental Score, and vector string will appear here.
  </p>

  <div className='mt-8 text-center'>
    <h1 className='text-6xl font-bold text-[#002C49]'>
      {baseScore.toFixed(1)}
    </h1>

    <div className='mt-4 inline-block px-8 py-2 rounded-full bg-[#6A3B07] text-[#F5A623] font-semibold'>
      {severity}
    </div>
  </div>

  <div className='mt-8 border-t border-[#B8DDF7] pt-6 grid grid-cols-3 text-center'>
    <div>
      <p className='text-sm opacity-70'>Base Score:</p>
      <p className='text-3xl font-bold text-[#002C49]'>{baseScore.toFixed(1)}</p>
    </div>

    <div>
      <p className='text-sm opacity-70'>Temporal Score:</p>
      <p className='text-3xl font-bold text-[#002C49]'>N/A</p>
    </div>

    <div>
      <p className='text-sm opacity-70'>Environmental Score:</p>
      <p className='text-3xl font-bold text-[#002C49]'>N/A</p>
    </div>
  </div>

    <div className='mt-8 border-t border-[#B8DDF7] pt-6 flex items-center justify-between gap-4'>
    <div className='w-[380px] max-w-full rounded-md border border-[#B8DDF7] bg-[#EEF8FC] px-4 py-2 text-center text-xs text-[#1767AA] font-medium font-montserrat'>
        {vectorString}
    </div>

    <button
        onClick={copyVector}
        className="
            px-8 py-2
            rounded-xl
            text-white
            font-semibold
            font-montserrat
            bg-gradient-to-r
            from-[#356CB9]
            via-[#4D95DA]
            to-[#66C0EF]
            shadow-[0_4px_10px_rgba(77,149,218,0.35)]
            hover:brightness-105
            transition-all
        "
        >
        Copy Vector
    </button>
    </div>
  </div>
  </div>
)
}

export default CVSSCalculator