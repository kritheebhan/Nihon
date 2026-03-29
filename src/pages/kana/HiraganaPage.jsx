import { useState } from 'react';
import { HIRA } from '../../data/kanaData';

const groups = [
  { key: 'basic',   label: 'Basic',        sub: 'あ → ん  ·  46 chars' },
  { key: 'dakuten', label: 'Voiced',        sub: 'が → ぽ  ·  25 chars' },
  { key: 'combo',   label: 'Combinations', sub: 'きゃ → ぴょ  ·  33 chars' },
];

const views = [
  { key: 'all', label: 'Full'    },
  { key: 'jp',  label: 'Kana'   },
  { key: 'rom', label: 'Romaji' },
];

export default function HiraganaPage() {
  const [group, setGroup] = useState('basic');
  const [view, setView]   = useState('all');
  const [popup, setPopup] = useState(null);

  const rows = HIRA[group];

  return (
    <div className="max-w-4xl page-enter">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Hiragana</h2>
          <span className="text-slate-300 font-light text-xl">—</span>
          <span className="text-2xl font-bold text-pink-500" style={{fontFamily:'Noto Sans JP,sans-serif'}}>ひらがな</span>
        </div>
        <p className="text-sm text-slate-500">The primary Japanese syllabary. Click any character for details.</p>
      </div>

      {/* Controls row */}
      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 mb-5 sm:mb-6 flex-wrap">
        {/* Group tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {groups.map(g => (
            <button key={g.key} onClick={() => setGroup(g.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border-none ${
                group === g.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              {g.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {views.map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border-none ${
                view === v.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-label */}
      <p className="text-xs text-slate-400 mb-5">{groups.find(g => g.key === group)?.sub}</p>

      {/* Character grid */}
      {rows.map(row => (
        <div key={row.r} className="mb-5">
          <div className="section-label mb-2">{row.r}</div>
          <div className="flex flex-wrap gap-2">
            {row.chars.map(ch => (
              <button
                key={ch.c}
                onClick={() => setPopup(ch)}
                className="bg-white border border-slate-200 rounded-xl p-2.5 text-center hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md transition-all w-16 shrink-0 cursor-pointer shadow-sm"
              >
                {(view === 'all' || view === 'jp') && (
                  <span className="block text-2xl font-bold text-pink-500 mb-0.5 leading-none" style={{fontFamily:'Noto Sans JP,sans-serif'}}>{ch.c}</span>
                )}
                {(view === 'all' || view === 'rom') && (
                  <span className="block text-[0.65rem] font-semibold text-slate-500">{ch.r}</span>
                )}
                {view === 'all' && ch.e && (
                  <span className="block text-[0.55rem] text-slate-400 mt-0.5 leading-tight">{ch.e}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setPopup(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-8 text-center w-full sm:max-w-[260px] shadow-xl" onClick={e => e.stopPropagation()}>
            <span className="block text-[5.5rem] font-bold text-pink-500 mb-3 leading-none" style={{fontFamily:'Noto Sans JP,sans-serif'}}>{popup.c}</span>
            <div className="text-2xl font-black text-slate-800 mb-1">{popup.r}</div>
            {popup.e && <div className="text-sm text-slate-500 mb-5">{popup.e}</div>}
            <button
              onClick={() => setPopup(null)}
              className="px-5 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer border-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
