import { NavLink, useLocation } from 'react-router-dom';
import { n5Secs, n4Secs, D, displayName } from '../data';

const NAV = [
  { to: '/',         label: 'Vocabulary', icon: '📖', end: true },
  { to: '/hiragana', label: 'Hiragana',   icon: '🌸' },
  { to: '/katakana', label: 'Katakana',   icon: '⚡' },
  { to: '/grammar',  label: 'Grammar',    icon: '📝' },
  { to: '/mnn',      label: 'MNN',        icon: '📗' },
  { to: '/genki',    label: 'Genki',      icon: '📙' },
  { to: '/test',     label: 'Test',       icon: '✏️' },
];

function SidebarContent({ onNavigate }) {
  const location = useLocation();
  const isVocabPage =
    location.pathname === '/' ||
    location.pathname.startsWith('/section') ||
    location.pathname === '/search';

  return (
    <div className="flex flex-col h-full">
      {/* ── Main Navigation ── */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 px-2 mb-1.5">
          Navigation
        </p>
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.82rem] font-medium transition-colors no-underline mb-0.5 ${
                isActive
                  ? 'bg-n5-light text-n5 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className="text-base w-5 text-center leading-none shrink-0">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>

      {/* ── Vocabulary Sections (only on vocab pages) ── */}
      {isVocabPage && (
        <div className="flex-1 overflow-y-auto sidebar-scroll border-t border-slate-100 mt-1 pt-3 pb-3">
          {/* N5 */}
          <div className="mb-3">
            <div className="px-3 mb-1 flex items-center gap-2">
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-n5">N5</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            {n5Secs.map(s => (
              <NavLink
                key={s}
                to={`/section/${encodeURIComponent(s)}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center justify-between mx-2 px-2.5 py-1.5 rounded-lg text-[0.75rem] transition-colors no-underline ${
                    isActive
                      ? 'bg-blue-50 text-n5 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <span className="truncate">{displayName(s)}</span>
                <span className="text-[0.58rem] text-slate-400 shrink-0 ml-1 tabular-nums">{D[s].length}</span>
              </NavLink>
            ))}
          </div>

          {/* N4 */}
          <div>
            <div className="px-3 mb-1 flex items-center gap-2">
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-n4">N4</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            {n4Secs.map(s => (
              <NavLink
                key={s}
                to={`/section/${encodeURIComponent(s)}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center justify-between mx-2 px-2.5 py-1.5 rounded-lg text-[0.75rem] transition-colors no-underline ${
                    isActive
                      ? 'bg-purple-50 text-n4 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <span className="truncate">{displayName(s)}</span>
                <span className="text-[0.58rem] text-slate-400 shrink-0 ml-1 tabular-nums">{D[s].length}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* ── Desktop sidebar (always visible) ── */}
      <aside className="w-[220px] min-w-[220px] bg-white border-r border-slate-200 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto sidebar-scroll hidden md:flex flex-col shrink-0">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-btn flex items-center justify-center text-white font-black text-xs">日</div>
            <span className="text-sm font-semibold text-slate-800">Nihongo</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
          </button>
        </div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          <SidebarContent onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}
