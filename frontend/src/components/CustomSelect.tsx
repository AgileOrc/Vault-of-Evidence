import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type SelectOption = { value: string; label: string }

function CustomSelect({ value, onChange, options, isDark }: {
    value: string
    onChange: (val: string) => void
    options: SelectOption[]
    isDark: boolean
}) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedLabel = options.find(o => o.value === value)?.label ?? options[0].label

    return (
        <div ref={ref} className='relative shrink-0 w-full md:w-36 lg:w-48'>
            {/* Trigger Button */}
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center gap-2 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 border text-sm md:text-base font-montserrat transition-all ${
                    isDark
                        ? 'bg-gradient-to-br from-white/15 to-[#C2C2C2]/8 border-white/40 text-white'
                        : 'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border-[#27D6FF]/40 text-[#0F65AD]'
                }`}
            >
                <span className='flex-1 text-left'>{selectedLabel}</span>
                <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown List */}
            {isOpen && (
                <div className={`absolute z-50 top-full mt-1 w-full rounded-lg md:rounded-xl border overflow-hidden shadow-lg ${
                    isDark
                        ? 'bg-gradient-to-br from-white/15 to-[#C2C2C2]/8 border border-white/40 text-white shadow-[2px_2px_5px_2px_rgba(0,44,73,0.05)] backdrop-blur-lg'
                        : 'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border border-[#27D6FF]/40 text-[#002C49] shadow-[2px_2px_5px_2px_rgba(0,44,73,0.05)] backdrop-blur-lg'
                }`}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type='button'
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-3 md:px-4 py-2.5 text-sm md:text-base font-montserrat transition-colors ${
                                value === option.value
                                    ? 'bg-[#1767AA] text-white'
                                    : isDark
                                        ? 'text-white hover:bg-white/10'
                                        : 'text-[#002C49] hover:bg-[#27D6FF]/15'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CustomSelect
