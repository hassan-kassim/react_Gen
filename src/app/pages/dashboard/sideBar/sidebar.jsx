import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  X, 
  LogOut, 
} from 'lucide-react';
 
export default function Sidebar({ sidebarOpen, toggleSidebar }) {
    return (
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <span className="text-xl font-bold tracking-wide text-white">MyApp</span>
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-slate-400 hover:text-white"
            aria-label="Close Sidebar"
            aria-expanded={sidebarOpen}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <a 
            href="#dashboard" 
            className="flex items-center px-4 py-2.5 bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a 
            href="#users" 
            className="flex items-center px-4 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors"
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </a>
          <a 
            href="#settings" 
            className="flex items-center px-4 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    );
  }