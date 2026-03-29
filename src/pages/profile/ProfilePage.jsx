import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/icons/logo.png';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editName, setEditName]       = useState(false);
  const [newName, setNewName]         = useState(user?.name || '');
  const [editPass, setEditPass]       = useState(false);
  const [passForm, setPassForm]       = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg]                 = useState({ text: '', ok: true });

  /* ── Save name ── */
  const saveName = () => {
    if (!newName.trim()) return;
    const users = JSON.parse(localStorage.getItem('nihon_users') || '[]');
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) { users[idx].name = newName.trim(); localStorage.setItem('nihon_users', JSON.stringify(users)); }
    const session = { ...user, name: newName.trim() };
    localStorage.setItem('nihon_user', JSON.stringify(session));
    window.location.reload();          // reload so AuthContext picks up new name
  };

  /* ── Save password ── */
  const savePass = () => {
    const users = JSON.parse(localStorage.getItem('nihon_users') || '[]');
    const found = users.find(u => u.email === user.email);
    if (!found || found.password !== passForm.current) return setMsg({ text: 'Current password is wrong', ok: false });
    if (passForm.next.length < 6)     return setMsg({ text: 'New password must be at least 6 characters', ok: false });
    if (passForm.next !== passForm.confirm) return setMsg({ text: 'Passwords do not match', ok: false });
    found.password = passForm.next;
    localStorage.setItem('nihon_users', JSON.stringify(users));
    setMsg({ text: 'Password updated successfully', ok: true });
    setEditPass(false);
    setPassForm({ current: '', next: '', confirm: '' });
  };

  const handleLogout = () => { logout(); navigate('/welcome', { replace: true }); };

  return (
    <div className="max-w-lg mx-auto py-4">

      {/* ── Header card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0">
          {user?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-slate-900 truncate">{user?.name}</div>
          <div className="text-sm text-slate-500 truncate">{user?.email}</div>
          <span className="inline-flex items-center gap-1 mt-1.5 text-[0.65rem] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Active
          </span>
        </div>
        <img src={logo} alt="Nihongo" className="w-9 h-9 object-contain opacity-30 shrink-0" />
      </div>

      {/* ── Account info ── */}
      <div className="bg-white rounded-2xl border border-slate-200 mb-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Account Details</p>
        </div>

        {/* Name row */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</span>
            <button onClick={() => setEditName(e => !e)} className="text-xs text-blue-500 font-medium border-none bg-transparent cursor-pointer">
              {editName ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editName ? (
            <div className="flex gap-2 mt-2">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none"
              />
              <button onClick={saveName} className="px-4 py-2 gradient-btn text-white text-xs font-semibold rounded-xl border-none cursor-pointer">Save</button>
            </div>
          ) : (
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
          )}
        </div>

        {/* Email row */}
        <div className="px-5 py-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Email</span>
          <p className="text-sm font-medium text-slate-800">{user?.email}</p>
        </div>
      </div>

      {/* ── Password ── */}
      <div className="bg-white rounded-2xl border border-slate-200 mb-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Security</p>
          <button onClick={() => { setEditPass(e => !e); setMsg({ text: '', ok: true }); }}
            className="text-xs text-blue-500 font-medium border-none bg-transparent cursor-pointer">
            {editPass ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {editPass ? (
          <div className="px-5 py-4 space-y-3">
            {[['current','Current Password'],['next','New Password'],['confirm','Confirm New Password']].map(([k,label]) => (
              <div key={k}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
                <input
                  type="password"
                  value={passForm[k]}
                  onChange={e => setPassForm(f => ({ ...f, [k]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none"
                />
              </div>
            ))}
            {msg.text && (
              <p className={`text-xs font-medium px-3 py-2 rounded-xl ${msg.ok ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {msg.text}
              </p>
            )}
            <button onClick={savePass} className="w-full gradient-btn text-white text-sm font-semibold py-2.5 rounded-xl border-none cursor-pointer">
              Update Password
            </button>
          </div>
        ) : (
          <div className="px-5 py-4">
            <p className="text-sm text-slate-500">••••••••</p>
          </div>
        )}
      </div>

      {/* ── Storage info ── */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-4">
        <div className="flex items-start gap-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500 mt-0.5 shrink-0">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
          <div>
            <p className="text-xs font-semibold text-amber-700 mb-0.5">Local Storage</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Your credentials are saved locally on this device in <code className="font-mono bg-amber-100 px-1 rounded">nihon_users</code>. No server is used.
            </p>
          </div>
        </div>
      </div>

      {/* ── Logout ── */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-500 font-semibold rounded-2xl text-sm hover:bg-red-50 transition-colors cursor-pointer"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd"/>
          <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd"/>
        </svg>
        Sign Out
      </button>
    </div>
  );
}
