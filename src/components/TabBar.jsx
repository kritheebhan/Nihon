import { NavLink } from 'react-router-dom';

/* ─── SVG Icons ───────────────────────────────────────── */
const icons = {
  vocab: (active) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  hiragana: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} stroke="currentColor" className="w-6 h-6">
      {active
        ? <text x="4" y="19" fontSize="18" fontFamily="serif" fontWeight="bold">あ</text>
        : <text x="4" y="19" fontSize="18" fontFamily="serif">あ</text>
      }
    </svg>
  ),
  katakana: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} stroke="currentColor" className="w-6 h-6">
      {active
        ? <text x="4" y="19" fontSize="18" fontFamily="serif" fontWeight="bold">ア</text>
        : <text x="4" y="19" fontSize="18" fontFamily="serif">ア</text>
      }
    </svg>
  ),
  grammar: (active) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
    </svg>
  ),
  test: (active) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  ),
};

const tabs = [
  { to: '/app',          label: 'Vocab',    iconKey: 'vocab',    end: true },
  { to: '/app/hiragana', label: 'Hiragana', iconKey: 'hiragana' },
  { to: '/app/katakana', label: 'Katakana', iconKey: 'katakana' },
  { to: '/app/grammar',  label: 'Grammar',  iconKey: 'grammar'  },
  { to: '/app/test',     label: 'Test',     iconKey: 'test'     },
];

/* ─── Desktop top tab bar ─────────────────────────────── */
export function TopTabBar() {
  return (
    <nav className="hidden md:block bg-white border-b border-slate-200 sticky top-14 z-40">
      <div className="flex items-end px-4 overflow-x-auto no-scrollbar max-w-screen-2xl mx-auto">
        {tabs.map(({ to, label, iconKey, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-1.5 py-2.5 px-4 text-[0.8rem] font-medium whitespace-nowrap shrink-0 select-none transition-all duration-200 border-b-2 -mb-px ${
                isActive
                  ? 'text-n5 border-n5 font-semibold'
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-n5' : 'text-slate-400'}>
                  {icons[iconKey](isActive)}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

/* ─── Mobile bottom tab bar ───────────────────────────── */
export function BottomTabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 safe-area-inset-bottom">
      <div className="flex items-stretch">
        {tabs.map(({ to, label, iconKey, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2.5 flex-1 text-center select-none no-underline transition-all duration-200 ${
                isActive ? 'text-n5' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  {icons[iconKey](isActive)}
                </span>
                <span className={`text-[0.6rem] leading-none transition-all duration-200 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

/* ─── Default export: both ────────────────────────────── */
export default function TabBar() {
  return (
    <>
      <TopTabBar />
      <BottomTabBar />
    </>
  );
}
