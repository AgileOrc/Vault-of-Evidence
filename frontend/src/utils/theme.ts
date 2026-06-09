// ── Project status helpers ───────────────────────────────────────────────────
// Backend values: planning | active | paused | completed | archived
// Display labels: Upcoming  | Active | Paused | Completed  | Archived

export const projectStatusLabel = (status: string): string => {
    const s = (status || '').toLowerCase()
    if (s === 'planning')  return 'Upcoming'
    if (s === 'active')    return 'Active'
    if (s === 'paused')    return 'Paused'
    if (s === 'completed') return 'Completed'
    if (s === 'archived')  return 'Archived'
    return status.charAt(0).toUpperCase() + status.slice(1)
}

export const projectStatusBadge = (status: string, isDark: boolean): string => {
    const s = (status || '').toLowerCase()
    if (isDark) {
        if (s === 'active')    return 'bg-[#17E58F] text-[#005B35]'
        if (s === 'paused')    return 'bg-[#E6DF14] text-[#5B4100]'
        if (s === 'planning')  return 'bg-[#C017DE] text-[#40005B]'
        if (s === 'completed') return 'bg-[#22BBDE] text-[#00375C]'
        if (s === 'archived')  return 'bg-[#6B7280] text-[#F5F5F5]'
        return 'bg-[#22BBDE] text-[#00375C]'
    }
    if (s === 'active')    return 'bg-[#005B35] text-[#17E58F] font-semibold'
    if (s === 'paused')    return 'bg-[#5B4100] text-[#E6DF14] font-semibold'
    if (s === 'planning')  return 'bg-[#40005B] text-[#D633FF] font-semibold'
    if (s === 'completed') return 'bg-[#00375C] text-[#22BBDE] font-semibold'
    if (s === 'archived')  return 'bg-[#374151] text-[#D1D5DB] font-semibold'
    return 'bg-[#00375C] text-[#22BBDE] font-semibold'
}

// ── Page theme ───────────────────────────────────────────────────────────────
export const getPageTheme = (isDark: boolean) => isDark
    ? {
        cardBase:      'bg-gradient-to-br from-[#F5F5F5]/15 to-[#C2C2C2]/8 border border-[#F5F5F5]/40 text-white shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',
        text:          'text-white',
        textMuted:     'text-[#41B0EC]',
        buttonPrimary: 'bg-linear-to-br from-[#0EB8DF] to-[#138FC5] text-white hover:brightness-105',
        buttonDanger:  'text-[#EC2828] hover:text-white hover:bg-[#EC2828]',
        buttonOutline: 'text-[#41B0EC] border border-[#41B0EC] hover:text-white hover:bg-[#27D6FF]',
    }
    : {
        cardBase:      'bg-linear-to-br from-[#27D6FF]/5 to-[#1767AA]/5 border border-[#27D6FF]/40 text-[#002C49] shadow-[2px_2px_10px_2px_rgba(0,44,73,0.05)]',
        text:          'text-[#002C49]',
        textMuted:     'text-[#0E65AD]',
        buttonPrimary: 'bg-[#1767AA] text-white hover:bg-[#41B0EC] hover:text-white',
        buttonDanger:  'text-[#EC2828] hover:text-white hover:bg-[#EC2828]',
        buttonOutline: 'text-[#1767AA] border border-[#1767AA] hover:text-white hover:bg-[#1767AA]',
    }