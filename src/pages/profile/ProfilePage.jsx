import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/icons/logo.png';

export default function ProfilePage() {
  const { user, logout, updateProfileMeta, changePassword } = useAuth();
  const navigate = useNavigate();

  const [editName, setEditName]       = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    name: user?.name || '',
    age: user?.age || '',
    level: user?.level || 'Beginner',
    goal: user?.goal || ''
  });
  const [editPass, setEditPass]       = useState(false);
  const [passForm, setPassForm]       = useState({ next: '', confirm: '' });
  const [msg, setMsg]                 = useState({ text: '', ok: true });

  /* ── Save Profile Details (Name & Metadata) ── */
  const saveProfile = async () => {
    if (!profileForm.name.trim()) return;
    const { name, age, level, goal } = profileForm;
    const result = await updateProfileMeta({ name: name.trim(), age, level, goal });
    if (result.error) setMsg({ text: result.error, ok: false });
    else { setEditName(false); setMsg({ text: 'Profile updated', ok: true }); }
  };

  /* ── Save password ── */
  const savePass = async () => {
    if (passForm.next.length < 6)     return setMsg({ text: 'New password must be at least 6 characters', ok: false });
    if (passForm.next !== passForm.confirm) return setMsg({ text: 'Passwords do not match', ok: false });
    const result = await changePassword(passForm.next);
    if (result.error) return setMsg({ text: result.error, ok: false });
    setMsg({ text: 'Password updated successfully', ok: true });
    setEditPass(false);
    setPassForm({ next: '', confirm: '' });
  };

  const handleLogout = async () => { await logout(); navigate('/welcome', { replace: true }); };

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
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Account Details</p>
          <button onClick={() => setEditName(e => !e)} className="text-xs text-blue-500 font-medium border-none bg-transparent cursor-pointer">
            {editName ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Details */}
        <div className="px-5 py-4 border-b border-slate-100">
          {editName ? (
            <div className="space-y-3 mt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                <input
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Age</label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={e => setProfileForm({ ...profileForm, age: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">JLPT Level</label>
                  <select
                    value={profileForm.level}
                    onChange={e => setProfileForm({ ...profileForm, level: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Goal</label>
                <select
                  value={profileForm.goal}
                  onChange={e => setProfileForm({ ...profileForm, goal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="">Select a goal</option>
                  <option value="JLPT Preparation">JLPT Preparation</option>
                  <option value="Travel to Japan">Travel to Japan</option>
                  <option value="Watch Anime / Pop Culture">Watch Anime / Pop Culture</option>
                  <option value="Career / Work">Career / Work</option>
                </select>
              </div>
              <button 
                onClick={saveProfile} 
                className="w-full py-2.5 gradient-btn text-white text-sm font-semibold rounded-xl border-none cursor-pointer mt-2">
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Full Name</span>
                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Age</span>
                  <p className="text-sm font-medium text-slate-800">{user?.age || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Level</span>
                  <p className="text-sm font-medium text-slate-800">{user?.level || '—'}</p>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Goal</span>
                <p className="text-sm font-medium text-slate-800">{user?.goal || '—'}</p>
              </div>
            </div>
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
            {[['next','New Password'],['confirm','Confirm New Password']].map(([k,label]) => (
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
