import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useData, displayName } from '../context/DataContext';
import logo from '../assets/icons/logo.png';

/* ─── SVG Icons ───────────────────────────────────────── */
const Icon = ({ name, className = 'w-4 h-4' }) => {
  const paths = {
    vocab: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    hiragana: (
      <svg viewBox="0 0 24 24" className={className}>
        <text x="3" y="18" fontSize="16" fontFamily="serif" fill="currentColor">あ</text>
      </svg>
    ),
    katakana: (
      <svg viewBox="0 0 24 24" className={className}>
        <text x="3" y="18" fontSize="16" fontFamily="serif" fill="currentColor">ア</text>
      </svg>
    ),
    grammar: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
      </svg>
    ),
    mnn: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
      </svg>
    ),
    genki: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    test: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    home: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    about: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    ),
    kanji: (
      <svg viewBox="0 0 24 24" className={className}>
        <text x="3" y="18" fontSize="16" fontFamily="serif" fill="currentColor">漢</text>
      </svg>
    ),
  };
  return paths[name] || null;
};

const NAV = [
  { to: '/app',             label: 'Home',       iconKey: 'home',   end: true },
  { to: '/app/vocabulary',  label: 'Vocabulary', iconKey: 'vocab' },
  { to: '/app/kanji',       label: 'Kanji',      iconKey: 'kanji' },
  { to: '/app/hiragana',    label: 'Hiragana',   iconKey: 'hiragana' },
  { to: '/app/katakana',    label: 'Katakana',   iconKey: 'katakana' },
  { to: '/app/grammar',     label: 'Grammar',    iconKey: 'grammar' },
  { to: '/app/test',        label: 'Test',       iconKey: 'test'     },
];

function GrammarGroup({ item, onNavigate }) {
  const location = useLocation();
  const isGroupActive = item.children.some(c => location.pathname === c.to || location.pathname.startsWith(c.to + '/'));
  const [open, setOpen] = useState(isGroupActive);

  return (
    <div className="mb-0.5">
      {/* Group header (clickable toggle) */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.82rem] font-medium transition-colors border-none bg-transparent cursor-pointer ${
          isGroupActive ? 'text-n5 bg-n5-light font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <span className={`w-5 flex items-center justify-center shrink-0 ${isGroupActive ? 'text-n5' : 'text-slate-400'}`}>
          <Icon name={item.iconKey} className="w-4 h-4" />
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        <svg
          viewBox="0 0 20 20" fill="currentColor"
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        >
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* Sub-items */}
      {open && (
        <div className="ml-4 pl-2 border-l border-slate-100 mt-0.5 mb-1">
          {item.children.map(({ to, label, iconKey }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[0.78rem] font-medium transition-colors no-underline mb-0.5 ${
                  isActive
                    ? 'bg-n5-light text-n5 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-4 flex items-center justify-center shrink-0 ${isActive ? 'text-n5' : 'text-slate-400'}`}>
                    <Icon name={iconKey} className="w-3.5 h-3.5" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function VocabGroup({ level, color, activeColor, activeBg, sections, onNavigate }) {
  const { D } = useData();
  const location = useLocation();
  const isAnyActive = sections.some(s => location.pathname === `/app/section/${encodeURIComponent(s)}`);
  const [open, setOpen] = useState(isAnyActive);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer ${
          isAnyActive ? `${activeColor} font-semibold` : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`}
      >
        <span className={`text-[0.6rem] font-bold uppercase tracking-widest ${color}`}>{level}</span>
        <div className="flex-1 h-px bg-slate-100" />
        <svg
          viewBox="0 0 20 20" fill="currentColor"
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-90' : ''}`}
        >
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
        </svg>
      </button>

      {open && (
        <div className="mt-0.5 mb-1">
          {sections.map(s => (
            <NavLink
              key={s}
              to={`/app/section/${encodeURIComponent(s)}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center justify-between mx-2 px-2.5 py-1.5 rounded-lg text-[0.75rem] transition-colors no-underline ${
                  isActive ? `${activeBg} ${activeColor} font-semibold` : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <span className="truncate">{displayName(s)}</span>
              <span className="text-[0.58rem] text-slate-400 shrink-0 ml-1 tabular-nums">{D[s].length}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  const { n5VocabSecs, n4VocabSecs } = useData();
  const location = useLocation();
  const isVocabPage =
    location.pathname === '/app/vocabulary' ||
    location.pathname.startsWith('/app/section') ||
    location.pathname === '/app/search';

  return (
    <div className="flex flex-col h-full">
      {/* ── Main Navigation ── */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 px-2 mb-1.5">
          Navigation
        </p>
        {NAV.map((item) =>
          item.group ? (
            <GrammarGroup key={item.label} item={item} onNavigate={onNavigate} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.82rem] font-medium transition-colors no-underline mb-0.5 ${
                  isActive
                    ? 'bg-n5-light text-n5 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-5 flex items-center justify-center shrink-0 ${isActive ? 'text-n5' : 'text-slate-400'}`}>
                    <Icon name={item.iconKey} className="w-4 h-4" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          )
        )}
      </div>

      {/* ── Vocabulary Sections (only on vocab pages) ── */}
      {isVocabPage && (
        <div className="flex-1 overflow-y-auto sidebar-scroll border-t border-slate-100 mt-1 pt-2 pb-3 px-1">
          <VocabGroup
            level="N5"
            color="text-n5"
            activeColor="text-n5"
            activeBg="bg-blue-50"
            sections={n5VocabSecs}
            onNavigate={onNavigate}
          />
          <VocabGroup
            level="N4"
            color="text-n4"
            activeColor="text-n4"
            activeBg="bg-purple-50"
            sections={n4VocabSecs}
            onNavigate={onNavigate}
          />
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
            <img src={logo} alt="Nihongo" className="w-7 h-7 rounded-lg object-cover" />
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
