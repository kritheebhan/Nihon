export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Avatar / Logo */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-20 h-20 rounded-2xl gradient-btn flex items-center justify-center text-white font-black text-3xl shadow-lg select-none">
          日
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Nihongo Study</h1>
        <p className="text-sm text-slate-500 text-center">
          A personal JLPT N5 &amp; N4 vocabulary and grammar study app.
        </p>
      </div>

      {/* About card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">About</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Built to make studying Japanese more interactive — covering vocabulary flashcards,
          multiple-choice quizzes, kana practice, and comprehensive N5, N4 &amp; N3 grammar references.
        </p>
      </div>

      {/* Developer card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Developer</h2>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base shrink-0">
            K
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Kritheebhan</p>
            <p className="text-xs text-slate-400">Creator &amp; Developer</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* GitHub */}
          <a
            href="https://github.com/kritheebhan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors no-underline group"
          >
            {/* GitHub SVG logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-800 shrink-0" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">GitHub</p>
              <p className="text-[0.7rem] text-slate-400 truncate">github.com/kritheebhan</p>
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/kritheebhan-b-8b130b213"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-[#e8f0fb] transition-colors no-underline group"
          >
            {/* LinkedIn SVG logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0A66C2] shrink-0" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">LinkedIn</p>
              <p className="text-[0.7rem] text-slate-400 truncate">linkedin.com/in/kritheebhan-b</p>
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
