import { useState } from 'react';
import { useData } from '../../context/DataContext';

const groups = [
  { key: 'basic',   label: 'Basic'        },
  { key: 'dakuten', label: 'Voiced'       },
  { key: 'combo',   label: 'Combinations' },
];

const views = [
  { key: 'all', label: 'Full'   },
  { key: 'jp',  label: 'Kana'  },
  { key: 'rom', label: 'Romaji' },
];

const sub = {
  basic:   'ア → ン  ·  46 chars',
  dakuten: 'ガ → ポ  ·  25 chars',
  combo:   'キャ → ウォ  ·  36 chars',
};

/* Render a kana character — splits combo chars so small kana renders smaller */
function KanaChar({ c, color }) {
  if (c.length === 2) {
    return (
      <span className="inline-flex items-center justify-center leading-none" style={{fontFamily:'Noto Sans JP,sans-serif'}}>
        <span className={`text-2xl font-bold ${color}`}>{c[0]}</span>
        <span className={`text-base font-bold ${color} -ml-0.5`}>{c[1]}</span>
      </span>
    );
  }
  return (
    <span className={`text-2xl font-bold ${color} leading-none`} style={{fontFamily:'Noto Sans JP,sans-serif'}}>{c}</span>
  );
}

export default function KatakanaPage() {
  const { KATA } = useData();
  const [group, setGroup] = useState('basic');
  const [view, setView]   = useState('all');
  const [popup, setPopup] = useState(null);

  const rows = KATA[group];

  return (
    <div className="max-w-4xl mx-auto page-enter">

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Katakana</h2>
          <span className="text-slate-300 font-light text-xl">—</span>
          <span className="text-2xl font-bold text-amber-500" style={{fontFamily:'Noto Sans JP,sans-serif'}}>カタカナ</span>
        </div>
        <p className="text-sm text-slate-500">Used for foreign loanwords and emphasis. Same sounds as hiragana. Click any character for details.</p>
      </div>

      {/* Combined controls row */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-2 flex-wrap">
        {groups.map(g => (
          <button key={g.key} onClick={() => { setGroup(g.key); setPopup(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
              group === g.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {g.label}
          </button>
        ))}
        <div className="w-px bg-slate-300 mx-1 self-stretch" />
        {views.map(v => (
          <button key={v.key} onClick={() => setView(v.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
              view === v.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {v.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 mb-5">{sub[group]}</p>

      {popup ? (
        /* ── Character detail (inline, same page) ── */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Detail header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <button
              onClick={() => setPopup(null)}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Katakana · {group}</span>
          </div>

          {/* Detail body */}
          <div className="flex flex-col items-center justify-center py-12 px-8 bg-slate-50 gap-6">

            {/* Large character */}
            <div className="flex items-center justify-center">
              {popup.c.length === 2 ? (
                <span className="inline-flex items-end leading-none" style={{fontFamily:'Noto Sans JP,sans-serif'}}>
                  <span className="font-bold text-amber-500" style={{fontSize:'9rem'}}>{popup.c[0]}</span>
                  <span className="font-bold text-amber-500 mb-3" style={{fontSize:'5.5rem'}}>{popup.c[1]}</span>
                </span>
              ) : (
                <span className="font-bold text-amber-500 leading-none" style={{fontFamily:'Noto Sans JP,sans-serif', fontSize:'11rem'}}>{popup.c}</span>
              )}
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-10 py-5 text-center">
              <div className="text-4xl font-black text-slate-800 mb-2 tracking-wide">{popup.r}</div>
              {popup.h && (
                <div className="flex items-center justify-center gap-2 text-lg text-pink-500" style={{fontFamily:'Noto Sans JP,sans-serif'}}>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{fontFamily:'sans-serif'}}>Hiragana</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold">{popup.h}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Character grid ── */
        <>
          {rows.map(row => (
            <div key={row.r} className="mb-5">
              <div className="section-label mb-2">{row.r}</div>
              <div className="flex flex-wrap gap-2">
                {row.chars.map(ch => (
                  <button
                    key={ch.c}
                    onClick={() => setPopup(ch)}
                    className="bg-white border border-slate-200 rounded-xl p-2.5 text-center hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md transition-all w-16 shrink-0 cursor-pointer shadow-sm"
                  >
                    {(view === 'all' || view === 'jp') && (
                      <span className="block mb-0.5">
                        <KanaChar c={ch.c} color="text-amber-500" />
                      </span>
                    )}
                    {(view === 'all' || view === 'rom') && (
                      <span className="block text-[0.65rem] font-semibold text-slate-500">{ch.r}</span>
                    )}
                    {view === 'all' && ch.h && (
                      <span className="block text-[0.6rem] text-pink-400 mt-0.5 leading-tight" style={{fontFamily:'Noto Sans JP,sans-serif'}}>{ch.h}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
