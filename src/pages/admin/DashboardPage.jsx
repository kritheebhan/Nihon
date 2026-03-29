export default function DashboardPage() {
  const users = JSON.parse(localStorage.getItem('nihon_users') || '[]');
  const total     = users.length;
  const admins    = users.filter(u => u.role === 'admin').length;
  const regular   = users.filter(u => u.role !== 'admin').length;
  const today     = new Date().toDateString();
  const newToday  = users.filter(u => u.createdAt && new Date(u.createdAt).toDateString() === today).length;
  const recent    = [...users].reverse().slice(0, 5);

  const StatCard = ({ label, value, color, icon }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
      <div>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">All registered users and activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={total} color="bg-blue-50 text-blue-500"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
        />
        <StatCard label="Regular Users" value={regular} color="bg-green-50 text-green-500"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
        />
        <StatCard label="Admins" value={admins} color="bg-red-50 text-red-500"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>}
        />
        <StatCard label="New Today" value={newToday} color="bg-purple-50 text-purple-500"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
        />
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Recent Registrations</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Joined</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((u, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-500">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400 text-xs">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
