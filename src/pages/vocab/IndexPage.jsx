import { Link } from 'react-router-dom';
import { n5Secs, n4Secs, D, displayName, totalWords, n5Total, n4Total } from '../../data';

const features = [
  {
    to: '/test',
    label: 'Vocabulary Test',
    sub: '6 game modes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    ring: 'bg-blue-100',
  },
  {
    to: '/hiragana',
    label: 'Hiragana',
    sub: '104 characters',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    accent: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    ring: 'bg-pink-100',
  },
  {
    to: '/katakana',
    label: 'Katakana',
    sub: '107 characters',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    ring: 'bg-amber-100',
  },
  {
    to: '/grammar',
    label: 'Grammar',
    sub: 'N5 + N4 patterns',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
      </svg>
    ),
    accent: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    ring: 'bg-violet-100',
  },
];

const stats = [
  { value: totalWords, label: 'Total Words' },
  { value: n5Total,    label: 'N5 Words',    color: 'text-n5' },
  { value: n4Total,    label: 'N4 Words',    color: 'text-n4' },
  { value: n5Secs.length + n4Secs.length, label: 'Sections' },
];

export default function IndexPage() {
  return (
    <div className="max-w-5xl page-enter">
      {/* ── Hero ─────────────────────────────── */}
      <div className="hero-bg rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-200 mb-2 sm:mb-3">
          JLPT N5 · N4 · Complete Reference
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 leading-[1.1] tracking-tight">
          日本語語彙リスト
        </h1>
        <p className="text-blue-200 text-xs sm:text-sm mb-5 sm:mb-8 max-w-md leading-relaxed">
          Everything you need to master JLPT N5 and N4 — vocabulary, grammar, kana, and interactive tests.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="bg-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm">
              <div className={`text-xl sm:text-2xl font-black text-white ${color || ''}`}>{value}</div>
              <div className="text-[0.62rem] sm:text-[0.68rem] font-medium text-blue-200 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Decorative */}
        <div className="absolute right-6 top-4 text-white/[0.07] text-[5rem] sm:text-[7rem] font-black select-none pointer-events-none leading-none hidden sm:block" style={{fontFamily:'Noto Sans JP,sans-serif'}}>語</div>
      </div>

      {/* ── Quick Access ──────────────────────── */}
      <div className="mb-8">
        <h2 className="section-label mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {features.map(({ to, label, sub, icon, accent, bg, border, ring }) => (
            <Link
              key={to}
              to={to}
              className={`no-underline group flex flex-col gap-3 p-4 rounded-xl border ${border} ${bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className={`w-9 h-9 rounded-lg ${ring} ${accent} flex items-center justify-center`}>
                {icon}
              </div>
              <div>
                <div className={`text-sm font-semibold ${accent} leading-tight`}>{label}</div>
                <div className="text-[0.68rem] text-slate-500 mt-0.5">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Vocabulary Sections ───────────────── */}
      <div>
        <h2 className="section-label mb-3">Vocabulary Sections</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* N5 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
              <span className="w-5 h-5 rounded bg-n5 flex items-center justify-center text-[0.55rem] font-black text-white">N5</span>
              <span className="text-sm font-semibold text-slate-700">N5 Vocabulary</span>
              <span className="ml-auto text-[0.68rem] font-medium text-slate-400">{n5Total} words</span>
            </div>
            {n5Secs.map(s => (
              <Link
                key={s}
                to={`/section/${encodeURIComponent(s)}`}
                className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 last:border-0 no-underline group transition-colors hover:bg-blue-50/60"
              >
                <span className="text-[0.82rem] text-slate-700 group-hover:text-n5 transition-colors font-medium">{displayName(s)}</span>
                <span className="text-[0.65rem] text-slate-400 group-hover:text-n5 bg-slate-50 group-hover:bg-blue-100 px-2 py-0.5 rounded-md font-semibold transition-colors tabular-nums">
                  {D[s].length}
                </span>
              </Link>
            ))}
          </div>

          {/* N4 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
              <span className="w-5 h-5 rounded bg-n4 flex items-center justify-center text-[0.55rem] font-black text-white">N4</span>
              <span className="text-sm font-semibold text-slate-700">N4 Vocabulary</span>
              <span className="ml-auto text-[0.68rem] font-medium text-slate-400">{n4Total} words</span>
            </div>
            {n4Secs.map(s => (
              <Link
                key={s}
                to={`/section/${encodeURIComponent(s)}`}
                className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 last:border-0 no-underline group transition-colors hover:bg-purple-50/60"
              >
                <span className="text-[0.82rem] text-slate-700 group-hover:text-n4 transition-colors font-medium">{displayName(s)}</span>
                <span className="text-[0.65rem] text-slate-400 group-hover:text-n4 bg-slate-50 group-hover:bg-purple-100 px-2 py-0.5 rounded-md font-semibold transition-colors tabular-nums">
                  {D[s].length}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
