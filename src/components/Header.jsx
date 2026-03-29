import { Link } from 'react-router-dom';
import { totalWords, n5Total, n4Total } from '../data';

export default function Header({ onMenuClick }) {
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

          <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center text-white font-black text-sm shadow-sm">
              日
            </div>
            <div className="leading-none">
              <div className="text-[0.82rem] font-bold text-slate-900 tracking-tight">Nihongo</div>
              <div className="text-[0.62rem] text-slate-400 font-medium tracking-wide hidden sm:block">JLPT Study</div>
            </div>
          </Link>
        </div>

        {/* Right: stats */}
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-[0.68rem] font-semibold bg-slate-100 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
            {totalWords} words
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 h-7 rounded-lg text-[0.65rem] sm:text-[0.68rem] font-semibold bg-blue-50 text-n5 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-n5 inline-block hidden sm:inline-block" />
            N5 · {n5Total}
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 h-7 rounded-lg text-[0.65rem] sm:text-[0.68rem] font-semibold bg-purple-50 text-n4 border border-purple-100">
            <span className="w-1.5 h-1.5 rounded-full bg-n4 inline-block hidden sm:inline-block" />
            N4 · {n4Total}
          </span>
        </div>

      </div>
    </header>
  );
}
