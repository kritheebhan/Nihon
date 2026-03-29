import { useState } from 'react';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers]   = useState(() => JSON.parse(localStorage.getItem('nihon_users') || '[]'));

  const deleteUser = (email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    const updated = users.filter(u => u.email !== email);
    localStorage.setItem('nihon_users', JSON.stringify(updated));
    setUsers(updated);
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} registered accounts</p>
        </div>
        <div className="relative">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users…"
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-400 w-52"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">#</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Joined</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Last Login</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400 text-sm">No users found</td></tr>
            )}
            {filtered.map((u, i) => (
              <tr key={u.email} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-slate-400 text-xs">{i + 1}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-500">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400 text-xs">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-5 py-3 text-slate-400 text-xs">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td className="px-5 py-3">
                  {u.role !== 'admin' && (
                    <button onClick={() => deleteUser(u.email)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium border-none bg-transparent cursor-pointer transition-colors">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
