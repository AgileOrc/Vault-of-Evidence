import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Engagement Overview</h2>
          <p className="text-gray-500 mt-1">Summary of current penetration testing projects.</p>
        </div>
        <button className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer">
          + New Testing Scope
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Critical Findings', value: '12', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'High Findings', value: '24', color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Active Worklists', value: '8', color: 'text-[var(--color-brand-primary)]', bg: 'bg-blue-50' },
          { label: 'Total Endpoints Checked', value: '1,420', color: 'text-gray-700', bg: 'bg-gray-100' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <span className="text-gray-500 font-medium">{stat.label}</span>
            <span className={`text-4xl font-bold mt-4 ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Findings Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Recent Findings</h3>
            <Link to="/Findings" className="text-[var(--color-brand-primary)] text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Vulnerability</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Endpoint</th>
                  <th className="px-6 py-4 font-medium">CVSS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'SQL Injection', severity: 'Critical', endpoint: '/api/v1/users', cvss: '9.8' },
                  { name: 'Cross-Site Scripting (XSS)', severity: 'High', endpoint: '/dashboard/profile', cvss: '7.5' },
                  { name: 'Insecure Direct Object Reference', severity: 'High', endpoint: '/api/v1/bills', cvss: '7.2' },
                  { name: 'Information Disclosure', severity: 'Medium', endpoint: '/headers', cvss: '5.3' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{row.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        row.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        row.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{row.endpoint}</td>
                    <td className="px-6 py-4 font-mono text-sm">{row.cvss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Worklist */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-800">In-Progress Worklists</h3>
            <Link to="/Worklist" className="text-[var(--color-brand-primary)] text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {[
              { task: 'Web App Pentest - Phase 1', progress: 75, due: 'Today' },
              { task: 'API Security Audit', progress: 40, due: 'Tomorrow' },
              { task: 'Mobile App Assessment', progress: 10, due: 'Next Week' },
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800 text-sm">{item.task}</span>
                  <span className="text-xs text-gray-500 font-medium">Due {item.due}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2 mt-4">
                  <div className="bg-[var(--color-brand-light)] h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
                <span className="text-xs text-gray-500">{item.progress}% Complete</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;