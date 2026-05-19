import { User, Shield, Bell, Database, Lock } from 'lucide-react';

function Settings() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account preferences and application settings.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar inside Settings */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1767AA] text-white font-medium cursor-pointer">
            <User className="w-5 h-5" />
            Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left">
            <Shield className="w-5 h-5" />
            Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left">
            <Bell className="w-5 h-5" />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left">
            <Database className="w-5 h-5" />
            Data Export
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
              <p className="text-sm text-gray-500 mt-1">Update your photo and personal details here.</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Avatar upload */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[var(--color-brand-light)] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                  J
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    Change
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                    Remove
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-light)] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-light)] focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input type="email" defaultValue="admin@vaultofevidence.local" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-light)] focus:outline-none bg-gray-50" readOnly />
                  <p className="text-xs text-gray-500 mt-1">To change your email address, contact an administrator.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <input type="text" defaultValue="Security Analyst" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50" readOnly />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button className="px-6 py-2 bg-[var(--color-brand-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-100 shadow-sm p-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Danger Zone
              </h3>
              <p className="text-sm text-red-600/80 mt-1">Permanent actions related to your account.</p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer text-sm shadow-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;