import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

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
  kanji: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 0 : 1.8} stroke="currentColor" className="w-6 h-6">
      {active
        ? <text x="4" y="19" fontSize="18" fontFamily="serif" fontWeight="bold">漢</text>
        : <text x="4" y="19" fontSize="18" fontFamily="serif">漢</text>
      }
    </svg>
  ),
  profile: (active) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  home: (active) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  study: (active) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
};

const tabs = [
  { to: '/app',             label: 'Home',     iconKey: 'home',   end: true },
  { to: '/app/vocabulary',  label: 'Vocab',    iconKey: 'vocab' },
  { to: '/app/kanji',       label: 'Kanji',    iconKey: 'kanji' },
  { to: '/app/hiragana',    label: 'Hiragana', iconKey: 'hiragana' },
  { to: '/app/katakana',    label: 'Katakana', iconKey: 'katakana' },
  { to: '/app/grammar',     label: 'Grammar',  iconKey: 'grammar'  },
  { to: '/app/test',        label: 'Test',     iconKey: 'test'     },
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

/* ─── Study popup sub-items ────────────────────────────── */
const studyItems = [
  { to: '/app/grammar',  label: 'Grammar',  icon: icons.grammar },
  { to: '/app/hiragana', label: 'Hiragana', icon: icons.hiragana },
  { to: '/app/katakana', label: 'Katakana', icon: icons.katakana },
  { to: '/app/kanji',    label: 'Kanji',    icon: icons.kanji },
  { to: '/app/test',     label: 'Test',     icon: icons.test },
];

/* ─── Mobile bottom tab bar ───────────────────────────── */
export function BottomTabBar() {
  const location = useLocation();
  const [studyOpen, setStudyOpen] = useState(false);
  const popupRef = useRef(null);

  const studyPaths = ['/app/grammar', '/app/hiragana', '/app/katakana', '/app/kanji', '/app/test'];
  const studyActive = studyPaths.some(p => location.pathname.startsWith(p));

  // Close popup on outside click
  useEffect(() => {
    if (!studyOpen) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setStudyOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [studyOpen]);

  // Close on route change
  useEffect(() => { setStudyOpen(false); }, [location.pathname]);

  const mobileTabs = [
    { to: '/app',         label: 'Home',    iconKey: 'home',   end: true },
    null, // study placeholder
    { to: '/app/profile', label: 'Profile', iconKey: 'profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 safe-area-inset-bottom">
      {/* Study popup — compact 5-item grid */}
      {studyOpen && (
        <div ref={popupRef} className="absolute bottom-full left-0 right-0 bg-white border-t border-slate-200 shadow-xl px-3 py-2.5">
          <div className="grid grid-cols-5 gap-1">
            {studyItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setStudyOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all no-underline ${
                    isActive ? 'bg-n5-light text-n5' : 'text-slate-500 active:bg-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="[&>svg]:w-5 [&>svg]:h-5">{icon(isActive)}</span>
                    <span className="text-[0.6rem] font-semibold leading-none">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-stretch">
        {mobileTabs.map((tab, i) => {
          // Study button
          if (tab === null) return (
            <button
              key="study"
              onClick={() => setStudyOpen(prev => !prev)}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 flex-1 text-center select-none transition-all duration-200 border-none cursor-pointer bg-transparent ${
                studyActive || studyOpen ? 'text-n5' : 'text-slate-400'
              }`}
            >
              <span className={`transition-transform duration-200 ${studyActive || studyOpen ? 'scale-110' : 'scale-100'}`}>
                {icons.study(studyActive || studyOpen)}
              </span>
              <span className={`text-[0.6rem] leading-none transition-all duration-200 ${studyActive || studyOpen ? 'font-bold' : 'font-medium'}`}>
                Study
              </span>
            </button>
          );

          const { to, label, iconKey, end } = tab;
          return (
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
          );
        })}
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
