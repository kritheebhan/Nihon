import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/icons/logo.png';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(form.email, form.password);
    if (result.error) { setError(result.error); setLoading(false); }
    else navigate(result.role === 'admin' ? '/admin' : '/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Nihongo" className="w-14 h-14 rounded-2xl object-cover shadow-lg mb-3" />
          <h1 className="text-2xl font-bold text-slate-900">Nihongo</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to continue studying</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">Welcome back</h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handle}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handle}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 text-xs font-medium">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn text-white font-semibold py-2.5 rounded-xl text-sm transition-opacity disabled:opacity-60 border-none cursor-pointer"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-n5 font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
