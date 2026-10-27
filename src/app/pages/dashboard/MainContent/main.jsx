export default function MainContent() {
        return (
            <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Stats / Content Grid Example */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">1,234</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Active Sessions</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">573</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">\$12,450</p>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Main Content Area</h2>
              <p className="text-slate-600">
                This area scrolls independently while keeping the sidebar and top header fixed in place.
              </p>
            </div>

          </div>
        </main>
        );
    }
