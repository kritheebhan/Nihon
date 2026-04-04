import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/icons/logo.png';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/welcome', { replace: true });
  };

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Avatar initials from user name */
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="flex items-center justify-between px-4 sm:px-5 h-14 max-w-screen-2xl mx-auto">

        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onMenuClick}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Open navigation"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 012 10z" clipRule="evenodd"/>
            </svg>
          </button>

          <Link to="/app" className="flex items-center gap-2 no-underline shrink-0">
            <img src={logo} alt="Nihongo" className="w-10 h-10 object-contain" />
            <div className="leading-none">
              <div className="text-[0.82rem] font-bold text-slate-900 tracking-tight">Nihongo</div>
              <div className="text-[0.62rem] text-slate-400 font-medium tracking-wide hidden sm:block">JLPT Study</div>
            </div>
          </Link>
        </div>

        {/* Right: profile (desktop only — mobile uses bottom tab bar) */}
        <div className="hidden md:flex items-center gap-1.5">
          {/* Profile dropdown */}
          {user && (
            <div className="relative ml-1 pl-2 border-l border-slate-200" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
              >
                {/* Avatar circle */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-n5 to-n4 flex items-center justify-center text-white text-[0.62rem] font-black shrink-0 select-none">
                  {initials}
                </div>
                <span className="hidden sm:block text-[0.75rem] font-semibold text-slate-700 max-w-[80px] truncate">
                  {user.name}
                </span>
                <svg
                  viewBox="0 0 20 20" fill="currentColor"
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd"/>
                </svg>
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-n5 to-n4 flex items-center justify-center text-white text-[0.7rem] font-black shrink-0 select-none">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[0.82rem] font-semibold text-slate-800 truncate">{user.name}</div>
                        <div className="text-[0.68rem] text-slate-400 truncate">{user.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      to="/app/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[0.82rem] text-slate-700 hover:bg-slate-50 no-underline transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 shrink-0">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd"/>
                      </svg>
                      My Profile
                    </Link>

                  </div>

                  {/* Divider + logout */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.82rem] text-red-600 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer text-left"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                        <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
