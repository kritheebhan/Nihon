import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/',         label: 'Vocab',    icon: '📖', end: true },
  { to: '/hiragana', label: 'Hiragana', icon: '🌸' },
  { to: '/katakana', label: 'Katakana', icon: '⚡' },
  { to: '/grammar',  label: 'Grammar',  icon: '📝' },
  { to: '/mnn',      label: 'MNN',      icon: '📗' },
  { to: '/genki',    label: 'Genki',    icon: '📙' },
  { to: '/test',     label: 'Test',     icon: '✏️' },
];

/* ─── Desktop top tab bar ─────────────────────────────── */
export function TopTabBar() {
  return (
    <nav className="hidden md:block bg-white border-b border-slate-200 sticky top-14 z-40">
      <div className="flex items-end px-4 overflow-x-auto no-scrollbar max-w-screen-2xl mx-auto">
        {tabs.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `py-2.5 px-4 text-[0.8rem] font-medium whitespace-nowrap shrink-0 select-none transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'text-n5 border-n5 font-semibold'
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`
            }
          >
            {label}
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
      <div className="flex items-stretch overflow-x-auto no-scrollbar">
        {tabs.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-2 px-3 flex-1 min-w-[52px] text-center shrink-0 transition-colors select-none no-underline ${
                isActive ? 'text-n5' : 'text-slate-400'
              }`
            }
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-[0.55rem] font-semibold leading-none">{label}</span>
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
