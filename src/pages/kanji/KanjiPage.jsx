import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useData, displayName } from '../../context/DataContext';
import KanjiAnimation from '../../components/KanjiAnimation';

const VIEW = { grid: 'grid', list: 'list' };

/* ── Stroke-by-stroke progression row ─────────────────────────────── */
function StrokeSteps({ kanji, size = 45, hideLabel = false }) {
  const [steps, setSteps] = useState(null);

  useEffect(() => {
    setSteps(null);
    fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${kanji}.json`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(data => {
        const svgs = [];
        const total = data.strokes.length;
        for (let step = 0; step < total; step++) {
          // Build SVG showing strokes 0..step, with outline of full character
          const paths = [];
          // Full outline (light gray)
          for (let s = 0; s < total; s++) {
            paths.push(`<path d="${data.strokes[s]}" fill="${s <= step ? '#1F2937' : '#E5E7EB'}" />`);
          }
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${size}" height="${size}"><g transform="scale(1,-1) translate(0,-900)">${paths.join('')}</g></svg>`;
          svgs.push(svg);
        }
        setSteps({ total, svgs });
      })
      .catch(() => setSteps(null));
  }, [kanji, size]);

  if (!steps) return null;

  return (
    <div className="max-w-full overflow-hidden">
      {!hideLabel && <div className="section-label mb-2">Stroke Order</div>}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={hideLabel ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
        <span className="text-xs font-bold text-slate-400 shrink-0">({steps.total})</span>
        {steps.svgs.map((svg, i) => (
          <div
            key={i}
            className="shrink-0 rounded border border-slate-100 bg-slate-50"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ))}
        {hideLabel && (
          <style>{`
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        )}
      </div>
    </div>
  );
}

/* ── Stroke-order popup (Grammar-style modal) ───────────────────────── */
function StrokePanel({ item, onClose }) {
  const [quizMode, setQuizMode] = useState(false);
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <div className="text-2xl font-black text-slate-900 mb-0.5 leading-none" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
              {item.kanji}
            </div>
            <div className="text-sm font-semibold text-slate-700 mt-1">{item.english}</div>
            <div className="text-xs text-indigo-500 font-medium">{item.kana}</div>
            {item.romaji && <div className="text-[0.65rem] text-slate-400">{item.romaji}</div>}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 shrink-0 ml-4 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer border-none text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-0.5 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setQuizMode(false)}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${!quizMode ? 'bg-white text-slate-700 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
            >
              ▶ Animation
            </button>
            <button
              onClick={() => setQuizMode(true)}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${quizMode ? 'bg-white text-slate-700 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
            >
              ✏ Quiz
            </button>
          </div>

          {/* Animation */}
          <div className="flex justify-center">
            <KanjiAnimation kanji={item.kanji} quizMode={quizMode} size={150} />
          </div>

          {/* Stroke-by-stroke progression */}
          <StrokeSteps kanji={item.kanji} />

          {/* Example word */}
          {item.example && (
            <div>
              <div className="section-label mb-2">Example</div>
              <div className="border-l-2 border-indigo-400 pl-3.5 py-0.5">
                <div className="text-sm font-medium text-slate-800 mb-0.5" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{item.example}</div>
                <div className="text-xs text-slate-400">{item.exReading}</div>
                <div className="text-xs text-indigo-500 italic">{item.exEnglish}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KanjiCard({ item, section, onStrokeClick }) {
  const level = section.startsWith('N5') ? 'N5' : section.startsWith('N4') ? 'N4' : 'N3';
  const borderLeft = level === 'N5' ? 'border-l-emerald-500' : level === 'N4' ? 'border-l-blue-500' : 'border-l-rose-500';

  return (
    <div
      onClick={() => onStrokeClick(item)}
      className={`bg-white rounded-lg border border-slate-200 ${borderLeft} border-l-[3px] hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden`}
    >
      <div className="flex">
        {/* Left — Large kanji + meaning */}
        <div className="flex flex-col items-center justify-center px-4 py-3 border-r border-slate-100 min-w-[90px]">
          <div className="text-[2.8rem] font-bold text-slate-900 leading-none" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
            {item.kanji}
          </div>
          <div className="text-[0.6rem] text-slate-400 mt-1">({item.english})</div>
        </div>

        {/* Right — readings + example */}
        <div className="flex-1 min-w-0 px-3 py-2.5 text-left">
          {/* Readings */}
          <div className="mb-1.5">
            {item.onReading && (
              <div className="flex items-baseline gap-1 text-[0.7rem] leading-snug">
                <span className="text-slate-400 font-bold shrink-0">音</span>
                <span className="text-slate-700 font-medium" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{item.onReading}</span>
              </div>
            )}
            {item.kunReading && (
              <div className="flex items-baseline gap-1 text-[0.7rem] leading-snug">
                <span className="text-slate-400 font-bold shrink-0">訓</span>
                <span className="text-slate-700 font-medium" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{item.kunReading}</span>
              </div>
            )}
          </div>

          {/* Example */}
          {item.example && (
            <div className="bg-slate-50 rounded px-2 py-1.5 mb-1.5">
              <span className="text-sm font-semibold text-slate-800" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{item.example}</span>
              <span className="text-[0.62rem] text-slate-400 ml-1">({item.exReading})</span>
              <span className="text-[0.62rem] text-blue-500 font-medium ml-1">{item.exEnglish}</span>
            </div>
          )}

          {/* Stroke steps instead of total count */}
          <div className="mt-1" onClick={e => e.stopPropagation()}>
            <StrokeSteps kanji={item.kanji} size={28} hideLabel={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KanjiPage() {
  const { D = {}, n5KanjiSecs = [], n4KanjiSecs = [], n3KanjiSecs = [], kanjiTotal = 0 } = useData() || {};
  const [activeLevel, setActiveLevel] = useState('all');
  const [view, setView] = useState(VIEW.grid);
  const [search, setSearch] = useState('');
  const [modalItem, setModalItem] = useState(null);

  const allKanjiSecs = [...n5KanjiSecs, ...n4KanjiSecs, ...n3KanjiSecs];
  const LEVELS = [
    { id: 'all', label: 'All Levels', secs: allKanjiSecs },
    { id: 'n5',  label: 'N5', secs: n5KanjiSecs, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-500' },
    { id: 'n4',  label: 'N4', secs: n4KanjiSecs, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    badge: 'bg-blue-500' },
    { id: 'n3',  label: 'N3', secs: n3KanjiSecs, color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200',    badge: 'bg-rose-500' },
  ];

  const currentLevel = LEVELS.find(l => l.id === activeLevel);
  const sections = currentLevel?.secs || [];

  if (!D || Object.keys(D).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Preparing content...</p>
        </div>
      </div>
    );
  }

  // Filter by search
  const filteredSections = sections.map(sec => {
    const items = (D[sec] || []).filter(item => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (item.kanji || '').includes(q) ||
             (item.kana || '').toLowerCase().includes(q) ||
             (item.english || '').toLowerCase().includes(q) ||
             (item.example || '').includes(q);
    });
    return { sec, items };
  }).filter(({ items }) => items.length > 0);

  const totalFiltered = filteredSections.reduce((s, { items }) => s + items.length, 0);

  return (
    <div className="max-w-6xl mx-auto page-enter">
      {/* Hero */}
      <div className="relative rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f172a 40%, #1e1b4b 70%, #312e81 100%)' }}>
        <div className="absolute right-6 top-3 text-white/[0.06] text-[6rem] sm:text-[8rem] font-black select-none pointer-events-none leading-none" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>漢字</div>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-purple-300 mb-2">
          JLPT N5 · N4 · N3
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight tracking-tight">
          漢字 Kanji
        </h1>
        <p className="text-purple-300/80 text-xs sm:text-sm mb-5 max-w-md leading-relaxed">
          {kanjiTotal} kanji across N5, N4, and N3 levels — organized by category for easy study.
        </p>

        {/* Level stats */}
        <div className="flex gap-2 flex-wrap">
          {LEVELS.slice(1).map(lv => {
            const count = lv.secs.reduce((s, k) => s + (D[k] || []).length, 0);
            return (
              <div key={lv.id} className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="text-lg font-black text-white">{count}</div>
                <div className="text-[0.62rem] font-medium text-purple-300">{lv.label} Kanji</div>
              </div>
            );
          })}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-lg font-black text-white">{kanjiTotal}</div>
            <div className="text-[0.62rem] font-medium text-purple-300">Total</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[180px] relative">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search kanji, reading, meaning..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>

          {/* Level filter */}
          <div className="flex gap-1.5">
            {LEVELS.map(lv => (
              <button
                key={lv.id}
                onClick={() => setActiveLevel(lv.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                  activeLevel === lv.id
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {lv.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setView(VIEW.grid)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all border-none ${
                view === VIEW.grid ? 'bg-white text-slate-700 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              ⊞ Grid
            </button>
            <button
              onClick={() => setView(VIEW.list)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all border-none ${
                view === VIEW.list ? 'bg-white text-slate-700 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              ☰ List
            </button>
          </div>

          {/* Count */}
          <span className="text-xs text-slate-400 font-medium">{totalFiltered} kanji</span>
        </div>
      </div>

      {/* Content */}
      {filteredSections.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="text-4xl mb-3 opacity-30">漢</div>
          <p className="text-sm font-semibold text-slate-700 mb-1">No kanji found</p>
          <p className="text-xs text-slate-400">Try a different search or level filter</p>
        </div>
      ) : view === VIEW.grid ? (
        /* Grid View */
        filteredSections.map(({ sec, items }) => {
          const level = sec.startsWith('N5') ? 'N5' : sec.startsWith('N4') ? 'N4' : 'N3';
          const dotColor = level === 'N5' ? 'bg-emerald-500' : level === 'N4' ? 'bg-blue-500' : 'bg-rose-500';
          const textColor = level === 'N5' ? 'text-emerald-600' : level === 'N4' ? 'text-blue-600' : 'text-rose-600';
          return (
            <div key={sec} className="mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                <h3 className={`text-sm font-bold ${textColor}`}>{displayName(sec)}</h3>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">{items.length} kanji</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {items.map((item, i) => (
                  <KanjiCard key={i} item={item} section={sec} onStrokeClick={setModalItem} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Kanji</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Reading</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Meaning</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Example</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">English</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Level</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Strokes</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.flatMap(({ sec, items }) =>
                items.map((item, i) => {
                  const level = sec.startsWith('N5') ? 'N5' : sec.startsWith('N4') ? 'N4' : 'N3';
                  const badgeClass = level === 'N5' ? 'badge-n5' : level === 'N4' ? 'badge-n4' : 'badge-n3';
                  return (
                    <tr key={`${sec}-${i}`} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{item.kanji}</td>
                      <td className="px-4 py-3 text-sm text-indigo-500 font-medium">{item.kana}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 font-semibold">{item.english}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{item.example || '—'}</td>
                      <td className="px-4 py-3 text-xs text-blue-500 hidden sm:table-cell">{item.exEnglish || '—'}</td>
                      <td className="px-4 py-3"><span className={badgeClass}>{level}</span></td>
                      <td className="px-4 py-3 align-middle">
                        <div onClick={e => e.stopPropagation()} className="min-w-[120px] max-w-[200px]">
                          <StrokeSteps kanji={item.kanji} size={28} hideLabel={true} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup modal — portaled to body to avoid stacking context issues */}
      {modalItem && createPortal(
        <StrokePanel item={modalItem} onClose={() => setModalItem(null)} />,
        document.body
      )}

    </div>
  );
}
