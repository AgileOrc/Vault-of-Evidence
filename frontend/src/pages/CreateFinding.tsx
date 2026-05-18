import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateFinding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    severity: '',
    cvss: '',
    endpoints: '',
    description: '',
    reproduction: '',
    impact: '',
    remediation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cvss: parseFloat(formData.cvss) || 0
      };

      const response = await fetch('http://localhost:8080/api/findings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate('/Findings');
      } else {
        alert('Failed to save finding');
      }
    } catch (error) {
      console.error('Error saving finding:', error);
      alert('An error occurred while communicating with the server.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Finding</h2>
          <p className="text-gray-500 mt-1">Document a vulnerability found during your engagement.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-2">Finding Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. SQL Injection in User Login" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]" />
            </div>

            {/* Severity */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Severity</label>
              <select required name="severity" value={formData.severity} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] bg-white text-gray-700">
                <option value="">Select Severity...</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Informational">Informational</option>
              </select>
            </div>

            {/* CVSS */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">CVSS Score (0.0 - 10.0)</label>
              <input required name="cvss" value={formData.cvss} onChange={handleChange} type="number" step="0.1" min="0" max="10" placeholder="e.g. 9.8" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]" />
            </div>

            {/* Endpoints */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-2">Affected Endpoints</label>
              <input name="endpoints" value={formData.endpoints} onChange={handleChange} type="text" placeholder="e.g. https://api.example.com/v1/users/login" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]" />
              <p className="text-xs text-gray-500 mt-1">Separate multiple endpoints with commas.</p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-2">Vulnerability Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the vulnerability in detail..." className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]"></textarea>
            </div>

            {/* Reproduction Steps */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-2">Reproduction Steps</label>
              <textarea name="reproduction" value={formData.reproduction} onChange={handleChange} rows={4} placeholder="1. Go to...&#10;2. Input payload...&#10;3. Observe..." className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]"></textarea>
            </div>

            {/* Impact */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-2">Impact</label>
              <textarea name="impact" value={formData.impact} onChange={handleChange} rows={3} placeholder="What can an attacker achieve if this is exploited?" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]"></textarea>
            </div>

            {/* Remediation */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-2">Remediation Recommendations</label>
              <textarea name="remediation" value={formData.remediation} onChange={handleChange} rows={3} placeholder="How should the developer fix this vulnerability?" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]"></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 rounded-lg font-medium bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-dark)] transition-colors cursor-pointer">
              Save Finding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFinding;