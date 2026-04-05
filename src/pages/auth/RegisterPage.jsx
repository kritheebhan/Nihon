import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/icons/logo.png';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', email: '', password: '', confirm: '',
    age: '', goal: '', level: 'Beginner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    const result = await register(form.name, form.email, form.password, {
      age: form.age,
      goal: form.goal,
      level: form.level
    });
    if (result.error) { setError(result.error); setLoading(false); }
    else navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Nihongo" className="w-14 h-14 rounded-2xl object-cover shadow-lg mb-3" />
          <h1 className="text-2xl font-bold text-slate-900">Nihongo</h1>
          <p className="text-slate-500 text-sm mt-1">Create your account to start studying</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">Create account</h2>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handle}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Age</label>
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handle}
                  placeholder="E.g., 25"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Japanese Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handle}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                >
                  <option value="Beginner">Beginner (JLPT N5/N4)</option>
                  <option value="Intermediate">Intermediate (JLPT N3/N2)</option>
                  <option value="Advanced">Advanced (JLPT N1)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Why are you learning?</label>
              <select
                name="goal"
                value={form.goal}
                onChange={handle}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
              >
                <option value="">Select a goal</option>
                <option value="JLPT Preparation">JLPT Preparation</option>
                <option value="Travel to Japan">Travel to Japan</option>
                <option value="Watch Anime / Pop Culture">Watch Anime / Pop Culture</option>
                <option value="Career / Work">Career / Work</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handle}
                  placeholder="Min. 6 characters"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                <input
                  name="confirm"
                  type="password"
                  required
                  value={form.confirm}
                  onChange={handle}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>
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
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-n5 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
