import { useState } from 'react';

export default function CredentialsPage() {
  const [show, setShow]   = useState({});
  const [search, setSearch] = useState('');
  const users = JSON.parse(localStorage.getItem('nihon_users') || '[]');

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Credentials</h2>
          <p className="text-sm text-slate-500 mt-0.5">All login details stored in localStorage</p>
        </div>
        <div className="relative">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-400 w-48"
          />
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-5">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
        </svg>
        <p className="text-xs text-amber-700 leading-relaxed">
          Credentials are stored in <code className="font-mono bg-amber-100 px-1 rounded">localStorage</code> on this device only. Passwords are stored as plain text — for production use a real backend with hashing.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Password</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Storage Key</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[0.6rem] font-bold">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600 font-mono text-xs">{u.email}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-700">
                      {show[i] ? u.password : '••••••••'}
                    </span>
                    <button onClick={() => setShow(s => ({ ...s, [i]: !s[i] }))}
                      className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0">
                      {show[i]
                        ? <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd"/><path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z"/></svg>
                        : <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd"/></svg>
                      }
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-400">nihon_users</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
