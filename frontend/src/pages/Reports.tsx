import { FileText, Download, Calendar, Filter, MoreVertical, Plus } from 'lucide-react';

const mockReports = [
  { id: 'REP-001', name: 'Web App Pentest - Phase 1', date: 'Oct 15, 2026', scope: 'Core Platform', format: 'PDF', size: '2.4 MB' },
  { id: 'REP-002', name: 'API Security Audit (v2)', date: 'Oct 10, 2026', scope: 'Backend APIs', format: 'PDF', size: '1.8 MB' },
  { id: 'REP-003', name: 'External Infrastructure Scan', date: 'Sep 28, 2026', scope: 'External Subnets', format: 'CSV', size: '145 KB' },
  { id: 'REP-004', name: 'Mobile App Assessment', date: 'Sep 15, 2026', scope: 'iOS & Android App', format: 'PDF', size: '3.1 MB' },
];

function Reports() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
          <p className="text-gray-500 mt-1">Generate, view, and export penetesting engagement reports.</p>
        </div>
        <button className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Generate Report
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            Format
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-gray-50 text-gray-500 text-sm sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium border-b border-gray-200">Report Name</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200">Date Generated</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200">Scope</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200">Format / Size</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[var(--color-brand-primary)]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">{report.name}</span>
                      <span className="text-xs text-gray-500 font-mono mt-0.5">{report.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {report.date}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md">
                    {report.scope}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700 text-sm">{report.format}</span>
                    <span className="text-xs text-gray-500">{report.size}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-500 hover:text-[var(--color-brand-primary)] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors cursor-pointer">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {mockReports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No reports generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;