import { useState, useEffect } from 'react';
import { Target, Globe, Smartphone, Server, Trash2, Plus } from 'lucide-react';

function Scopes() {
  const [scopes, setScopes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', target: '', type: 'Web App', description: '' });

  const fetchScopes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/scopes');
      if (response.ok) {
        const data = await response.json();
        setScopes(data);
      }
    } catch (error) {
      console.error('Failed to fetch scopes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScopes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/scopes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsAdding(false);
        setFormData({ name: '', target: '', type: 'Web App', description: '' });
        fetchScopes();
      }
    } catch (error) {
      console.error('Failed to create scope', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scope?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/scopes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchScopes();
      }
    } catch (error) {
      console.error('Failed to delete scope', error);
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'Mobile App') return <Smartphone className="w-5 h-5 text-purple-500" />;
    if (type === 'Network / CIDR') return <Server className="w-5 h-5 text-gray-500" />;
    return <Globe className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full">
      <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Testing Scopes</h2>
          <p className="text-gray-500 mt-1">Manage approved targets and rules of engagement parameters.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancel' : 'Add Target Scope'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl border border-[var(--color-brand-light)] shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">New Target Scope</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company / Project Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]" placeholder="e.g. Acme Corp Vault" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Target Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]">
                  <option value="Web App">Web App (URL / Domain)</option>
                  <option value="Mobile App">Mobile App (APK / IPA)</option>
                  <option value="Network / CIDR">Network (IP / CIDR)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Target Location (URL, IPs, etc.)</label>
                <input required type="text" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]" placeholder="https://vpn.example.com or 192.168.1.0/24" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description / Credentials</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]" placeholder="Optional notes for testers..."></textarea>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-[var(--color-brand-primary)] text-white px-6 py-2 rounded-lg font-medium hover:bg-[var(--color-brand-dark)] transition-colors cursor-pointer">
                Save Scope
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scope List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-auto p-4">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading scopes...</div>
        ) : scopes.length === 0 ? (
           <div className="text-center text-gray-500 py-10 flex flex-col items-center">
             <Target className="w-12 h-12 text-gray-300 mb-3" />
             <p>No testing scopes defined yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scopes.map(scope => (
              <div key={scope.ID} className="border border-gray-100 p-5 rounded-xl hover:shadow-md transition-shadow group relative flex flex-col">
                <button onClick={() => handleDelete(scope.ID)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getTypeIcon(scope.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{scope.name}</h3>
                    <span className="text-xs font-semibold text-[var(--color-brand-primary)]">{scope.type}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-mono text-gray-600 bg-gray-50 p-2 rounded truncate" title={scope.target}>
                    {scope.target}
                  </p>
                </div>
                {scope.description && (
                  <p className="text-sm text-gray-500 mt-auto line-clamp-2">
                    {scope.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Scopes;