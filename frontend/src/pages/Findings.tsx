import { Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, ShieldAlert, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

function Findings() {
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFindings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/findings');
        if (response.ok) {
          const data = await response.json();
          setFindings(data);
        }
      } catch (error) {
        console.error('Failed to fetch findings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFindings();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Findings</h2>
          <p className="text-gray-500 mt-1">Manage and track identified vulnerabilities across targets.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <Link to="/Findings/New" className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer text-center">
            + Add Finding
          </Link>
        </div>
      </div>
      
      {/* Table Toolbar */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex items-center justify-between shrink-0">
        <div className="relative w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search vulnerabilities..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            Severity
          </button>
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            Status
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-gray-50 text-gray-500 text-sm sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium border-b border-gray-200 w-12">
                <input type="checkbox" className="rounded border-gray-300 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]" />
              </th>
              <th className="px-6 py-4 font-medium border-b border-gray-200">ID & Title</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200">Severity</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200">CVSS</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200">Endpoint</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200">Status</th>
              <th className="px-6 py-4 font-medium border-b border-gray-200"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading findings...</td></tr>
            ) : findings.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No findings generated yet. Click "+ Add Finding" to start.</td></tr>
            ) : (
              findings.map((finding, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{finding.title}</span>
                      <span className="text-xs text-gray-500 mt-0.5 font-mono">VULN-{finding.ID}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {finding.severity === 'Critical' && <ShieldAlert className="w-4 h-4 text-red-600" />}
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        finding.severity === 'Critical' ? 'bg-red-50 text-red-700' :
                        finding.severity === 'High' ? 'bg-orange-50 text-orange-700' :
                        finding.severity === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {finding.severity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-sm font-bold ${
                      finding.cvss >= 9 ? 'text-red-600' : 
                      finding.cvss >= 7 ? 'text-orange-500' : 
                      finding.cvss >= 4 ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {finding.cvss.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm truncate max-w-xs" title={finding.endpoints}>
                    {finding.endpoints}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-sm font-medium ${
                      finding.status === 'Open' ? 'text-blue-600' :
                      finding.status === 'Fixed' ? 'text-green-600' :
                      'text-orange-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        finding.status === 'Open' ? 'bg-blue-600' :
                        finding.status === 'Fixed' ? 'bg-green-600' :
                        'bg-orange-500'
                      }`}></span>
                      {finding.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="bg-white border text-sm border-gray-200 border-t-0 rounded-b-xl p-4 flex justify-between items-center text-gray-500 shrink-0">
        <span>Showing {findings.length} entries</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer text-gray-600" disabled>Previous</button>
          <button className="px-3 py-1 border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white rounded-md cursor-pointer">1</button>
          <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer text-gray-600" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Findings;