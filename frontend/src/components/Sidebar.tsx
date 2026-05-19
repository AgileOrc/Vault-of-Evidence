import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ListTodo, Home, FileText, Settings, Target } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/Dashboard', icon: Home },
    { name: 'Scopes', path: '/Scopes', icon: Target },
    { name: 'Worklist', path: '/Worklist', icon: ListTodo },
    { name: 'Findings', path: '/Findings', icon: ShieldAlert },
    { name: 'Reports', path: '/Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-[#002C49] text-white hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-[#27D6FF]" />
        <h1 className="text-xl font-bold font-montserrat">Vault of Evidence</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = path.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive 
                  ? 'bg-[#1767AA] text-white' 
                  : 'text-gray-300 hover:bg-[#1767AA] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1767AA]">
        <Link 
          to="/Settings" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
            path.startsWith('/Settings') 
              ? 'bg-[#1767AA] text-white' 
              : 'text-gray-300 hover:bg-[#1767AA] hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;