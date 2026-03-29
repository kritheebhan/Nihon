import { useState } from 'react';
import { GRAMMAR } from '../../data/grammarData';

const levelConfig = {
  N5: { badge: 'bg-blue-50 text-n5 border-n5-border', bar: '#2563eb', label: 'Foundation' },
  N4: { badge: 'bg-purple-50 text-n4 border-n4-border', bar: '#7c3aed', label: 'Intermediate' },
  N3: { badge: 'bg-amber-50 text-amber-600 border-amber-200', bar: '#d97706', label: 'Upper Intermediate' },
};

const tagColors = {
  particles: 'bg-blue-50 text-blue-600 border-blue-100',
  verbs: 'bg-violet-50 text-violet-600 border-violet-100',
  adjectives: 'bg-pink-50 text-pink-600 border-pink-100',
  requests: 'bg-green-50 text-green-600 border-green-100',
  permission: 'bg-teal-50 text-teal-600 border-teal-100',
  obligation: 'bg-orange-50 text-orange-600 border-orange-100',
  time: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  desire: 'bg-rose-50 text-rose-600 border-rose-100',
  experience: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  listing: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  'te-form': 'bg-purple-50 text-purple-600 border-purple-100',
};

const n5Count = GRAMMAR.filter(g => g.level === 'N5').length;
const n4Count = GRAMMAR.filter(g => g.level === 'N4').length;
const n3Count = GRAMMAR.filter(g => g.level === 'N3').length;

const FILTERS = [
  { key: 'all',   label: 'All'               },
  { key: 'N5',    label: 'N5'                },
  { key: 'N4',    label: 'N4'                },
  { key: 'N3',    label: 'N3'                },
  { key: 'MNN',   label: 'Minna no Nihongo'  },
  { key: 'GENKI', label: 'Genki'             },
];

export default function GrammarPage() {
  const [filter, setFilter] = useState('all');
  const [modal, setModal]   = useState(null);

  const filtered = GRAMMAR.filter(g => {
    if (filter === 'all')   return true;
    if (filter === 'MNN')   return g.src.some(s => s.startsWith('MNN'));
    if (filter === 'GENKI') return g.src.some(s => s.startsWith('GENKI'));
    return g.level === filter;
  });

  const byLevel = ['N5', 'N4', 'N3'].map(lv => ({
    lv,
    items: filtered.filter(g => g.level === lv),
  })).filter(x => x.items.length > 0);

  return (
    <div className="max-w-5xl page-enter">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Grammar Patterns</h2>
        <p className="text-sm text-slate-500">Complete N5, N4 and N3 reference — click any card for detailed examples.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {[['N5', 'text-n5', n5Count], ['N4', 'text-n4', n4Count], ['N3', 'text-amber-600', n3Count], ['Total', 'text-slate-700', GRAMMAR.length]].map(([lv, color, cnt]) => (
          <div key={lv} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 text-center">
            <div className={`text-xl font-black ${color}`}>{cnt}</div>
            <div className="text-[0.62rem] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">{lv}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-1 sm:gap-1.5 flex-wrap mb-6 sm:mb-7 p-1 bg-slate-100 rounded-xl">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
              filter === key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards grouped by level */}
      {byLevel.map(({ lv, items }) => {
        const cfg = levelConfig[lv];
        return (
          <div key={lv} className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[0.65rem] font-bold border ${cfg.badge}`}>{lv}</span>
              <span className="text-sm font-semibold text-slate-700">{cfg.label}</span>
              <span className="text-xs text-slate-400">{items.length} patterns</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {items.map(g => (
                <button
                  key={g.id}
                  onClick={() => setModal(g)}
                  className="text-left bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: cfg.bar }} />

                  <div className="text-base font-bold text-slate-900 mb-0.5 pl-2 truncate" style={{fontFamily:'Noto Sans JP,sans-serif'}}>{g.title}</div>
                  <div className="text-xs font-semibold text-slate-500 mb-2 pl-2 truncate">{g.meaning}</div>
                  <div className="text-[0.7rem] font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 mb-2.5 text-slate-600 truncate">{g.structure}</div>

                  {g.examples[0] && (
                    <div className="text-[0.72rem] text-slate-600 mb-2.5 pl-1 truncate" style={{fontFamily:'Noto Sans JP,sans-serif'}}>
                      {g.examples[0].jp}
                    </div>
                  )}

                  <div className="flex gap-1 flex-wrap">
                    {g.tags.slice(0, 2).map(t => (
                      <span key={t} className={`tag ${tagColors[t] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>{t}</span>
                    ))}
                    {g.src.slice(0, 1).map(s => (
                      <span key={s} className="tag bg-slate-50 text-slate-400 border-slate-100">{s}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div>
                <div className="text-2xl font-black text-slate-900 mb-0.5" style={{fontFamily:'Noto Sans JP,sans-serif'}}>{modal.title}</div>
                <div className="text-sm font-semibold text-slate-500">{modal.meaning}</div>
              </div>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 shrink-0 ml-4 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer border-none text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Structure */}
              <div>
                <div className="section-label mb-2">Structure</div>
                <div className="font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-violet-700">{modal.structure}</div>
              </div>

              {/* Examples */}
              <div>
                <div className="section-label mb-3">Examples</div>
                <div className="space-y-2">
                  {modal.examples.map((ex, i) => (
                    <div key={i} className="border-l-2 border-n5 pl-3.5 py-0.5">
                      <div className="text-sm font-medium text-slate-800 mb-0.5" style={{fontFamily:'Noto Sans JP,sans-serif'}}>{ex.jp}</div>
                      {ex.ta && <div className="text-xs text-amber-600 mb-0.5">{ex.ta}</div>}
                      <div className="text-xs text-slate-500 italic">{ex.en}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tamil tip */}
              {modal.tamil && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <div className="section-label text-amber-600 mb-1.5">Tamil Tip</div>
                  <div className="text-sm text-amber-800 leading-relaxed">{modal.tamil}</div>
                </div>
              )}

              {/* Sources */}
              {modal.src.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {modal.src.map(s => (
                    <span key={s} className="tag bg-slate-50 text-slate-500 border-slate-200">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
