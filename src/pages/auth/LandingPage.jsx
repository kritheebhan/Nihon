import { Link } from 'react-router-dom';
import logo from '../../assets/icons/logo.png';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: '1,268 Vocabulary Words',
    desc: 'Complete N5 & N4 JLPT vocabulary with English, Japanese, and romaji.',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Hiragana & Katakana',
    desc: 'Master all kana characters with stroke guides and interactive practice.',
    color: 'bg-pink-50 text-pink-500',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
      </svg>
    ),
    title: 'Grammar Reference',
    desc: 'Clear explanations of N5–N4 grammar patterns with example sentences.',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Interactive Tests',
    desc: '6 game modes to test your vocabulary, kana, and grammar knowledge.',
    color: 'bg-purple-50 text-purple-500',
  },
];

const stats = [
  { value: '1,268', label: 'Total Words' },
  { value: '455',   label: 'N5 Words' },
  { value: '813',   label: 'N4 Words' },
  { value: '53',    label: 'Sections' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Nihongo" className="w-12 h-12 object-contain" />
            <span className="font-bold text-slate-900 text-[0.9rem]">Nihongo</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"
              className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 no-underline transition-colors">
              Sign In
            </Link>
            <Link to="/register"
              className="px-4 py-1.5 text-sm font-semibold gradient-btn text-white rounded-xl no-underline shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 px-5 text-center bg-gradient-to-b from-blue-50/60 to-white">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            JLPT N5 & N4 Complete Reference
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-5">
            日本語語彙<br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> リスト</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Everything you need to master JLPT N5 and N4 — vocabulary, grammar, kana, and interactive tests, all in one place.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/register"
              className="px-6 py-3 gradient-btn text-white font-semibold rounded-xl text-sm no-underline shadow-md hover:opacity-90 transition-opacity">
              Start Studying Free
            </Link>
            <Link to="/login"
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm no-underline hover:bg-slate-50 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-10 px-5 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Everything you need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ icon, title, desc, color }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  {icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-5 bg-gradient-to-br from-blue-600 to-purple-600 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to start?</h2>
          <p className="text-blue-100 text-sm mb-7">Create your account and begin studying Japanese today.</p>
          <Link to="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-xl text-sm no-underline hover:bg-blue-50 transition-colors shadow-lg">
            Create Account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 px-5 text-center text-xs text-slate-400 border-t border-slate-100">
        &copy; {new Date().getFullYear()} Nihongo — Study App
      </footer>
    </div>
  );
}
