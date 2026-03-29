import { useState } from 'react';
import { GENKI } from '../../data/genkiData';

export default function GenkiPage() {
  const [lesson, setLesson] = useState(GENKI[0]);
  const idx = GENKI.findIndex(l => l.n === lesson.n);

  return (
    <div className="max-w-4xl page-enter">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">げんき — Genki</h2>
        <p className="text-sm text-slate-500">Genki I — Lessons 3–12 vocabulary and grammar</p>
      </div>

      {/* Lesson selector */}
      <div className="mb-6">
        <div className="section-label mb-2.5">Select Lesson</div>
        <div className="flex gap-1 sm:gap-1.5 flex-wrap">
          {GENKI.map(l => (
            <button
              key={l.n}
              onClick={() => setLesson(l)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                lesson.n === l.n
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600'
              }`}
            >
              {l.n}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Lesson header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-amber-50/50">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-lg text-xs font-bold text-amber-600 bg-white border border-amber-200">
              Lesson {lesson.n}
            </span>
            <div>
              <div className="text-lg font-bold text-slate-900" style={{fontFamily:'Noto Sans JP,sans-serif'}}>{lesson.title}</div>
              <div className="text-sm text-slate-500">{lesson.en}</div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Grammar */}
          <div>
            <div className="section-label mb-3">Grammar Points</div>
            <ul className="space-y-2">
              {lesson.grammar.map((g, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span className="text-slate-700 leading-relaxed">{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vocabulary */}
          <div>
            <div className="section-label mb-3">Key Vocabulary</div>
            <div className="flex flex-wrap gap-2">
              {lesson.vocab.map((v, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 hover:border-amber-300 hover:bg-amber-50 transition-colors cursor-default"
                >
                  <span className="block text-sm font-bold text-slate-900" style={{fontFamily:'Noto Sans JP,sans-serif'}}>{v.j}</span>
                  <span className="block text-[0.62rem] text-slate-400 mt-0.5">{v.r}</span>
                  <span className="block text-[0.68rem] text-amber-600 font-medium mt-0.5">{v.e}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            disabled={idx === 0}
            onClick={() => setLesson(GENKI[idx - 1])}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-30 hover:border-slate-300 hover:text-slate-800 transition cursor-pointer"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M10 12L6 8l4-4"/></svg>
            Previous
          </button>
          <span className="text-xs text-slate-400 font-medium">{idx + 1} of {GENKI.length}</span>
          <button
            disabled={idx === GENKI.length - 1}
            onClick={() => setLesson(GENKI[idx + 1])}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-30 hover:border-slate-300 hover:text-slate-800 transition cursor-pointer"
          >
            Next
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M6 12l4-4-4-4"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
