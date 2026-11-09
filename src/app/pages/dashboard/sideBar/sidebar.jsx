import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  X, 
  LogOut, 
  FileText,
  FileBarChart
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '../../../../shared/store/authStore'; // Import the store hook
import { useRouter, usePathname } from 'next/navigation'; // Import the Next.js router hook

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
    const router = useRouter();
    const pathname = usePathname().split('/')[1];
    // Pull values and actions directly from the store
    const logoutAction = useAuthStore((state) => state.logout);

    const handleLogout = () => {
      logoutAction();
      router.push('/');
      router.refresh();
    };

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
          <Link 
            href="/dashboard" 
            className={`flex items-center px-4 py-2.5 ${pathname === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} rounded-lg font-medium transition-colors`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link 
            href="/users" 
            className={`flex items-center px-4 py-2.5 ${pathname === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} rounded-lg font-medium transition-colors`}
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </Link>
          <Link 
            href="/rag" 
            className={`flex items-center px-4 py-2.5 ${pathname === 'rag' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} rounded-lg font-medium transition-colors`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Rag
          </Link>
          <Link 
            href="/excelAnalytics" 
            className={`flex items-center px-4 py-2.5 ${pathname === 'excelAnalytics' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} rounded-lg font-medium transition-colors`}
          >
            <FileBarChart className="w-5 h-5 mr-3" />
            Excel Anaytics
          </Link>
          <Link 
            href="/settings" 
            className={`flex items-center px-4 py-2.5 ${pathname === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} rounded-lg font-medium transition-colors`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    );
  }