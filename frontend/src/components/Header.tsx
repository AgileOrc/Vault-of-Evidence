import { Search, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

function Header() {
  const [user, setUser] = useState({ name: '', role: '' })

  useEffect(() => {
    fetch('http://localhost:8080/api/me', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
      <div className="relative w-96">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search findings, scopes..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-light)]"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-[var(--color-brand-primary)] cursor-pointer">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-brand-light)] rounded-full flex items-center justify-center text-white font-bold">
            J
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{user.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{user.role || 'Security Analyst'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;