import { 
  Menu, 
  Bell 
} from 'lucide-react';

export default function TopHeader({sidebarOpen, toggleSidebar}) {
    return(
        <header className="flex items-center justify-between h-16 bg-white border-b border-slate-200 px-6 shrink-0">
          <div className="flex items-center">
            {/* Mobile Burger Menu Button */}
            <button 
              onClick={toggleSidebar}
              className="mr-4 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Open Sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800">Dashboard Overview</h1>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="top-1.5 right-1.5 absolute w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
              JD
            </div>
          </div>
        </header>
        )
    }