import { useSearchParams, Link } from 'react-router-dom';
import { useData, displayName, getLevel } from '../../context/DataContext';

export default function SearchPage() {
  const { D } = useData();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400 text-xl">?</div>
        <p className="text-sm text-slate-500">Type in the search box to find vocabulary</p>
      </div>
    );
  }

  const ql = query.toLowerCase().trim();
  const results = [];
  Object.keys(D).forEach(sec => {
    (D[sec] || []).forEach(w => {
      const str = `${w.kanji || ''} ${w.kana || ''} ${w.romaji || ''} ${w.english || ''}`;
      if (str.toLowerCase().includes(ql)) results.push({ sec, w });
    });
  });

  return (
    <div className="max-w-4xl mx-auto page-enter">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-slate-500 hover:text-slate-900 transition-colors no-underline">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M10 12L6 8l4-4"/></svg>
          Vocabulary
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-[0.78rem] font-medium text-slate-700">Search</span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          "{query}"
        </h2>
        <span className="text-sm text-slate-400">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/></svg>
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">No results found</p>
          <p className="text-xs text-slate-400">Try searching in English, Japanese, or romaji</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse vocab-table">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Section</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Kanji</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Reading</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Romaji</th>
                <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">English</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 150).map((r, i) => {
                const level = getLevel(r.sec);
                const badgeClass = level === 'N5' ? 'badge-n5' : level === 'N4' ? 'badge-n4' : 'badge-n3';
                return (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={badgeClass}>
                        {level} · {displayName(r.sec)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-base font-semibold text-slate-900 font-jp">{r.w.kanji}</td>
                    <td className="px-4 py-3 text-sm text-n5 font-medium">{r.w.kana}</td>
                    <td className="px-4 py-3 text-[0.75rem] text-slate-400 italic hidden sm:table-cell">{r.w.romaji}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.w.english}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {results.length > 150 && (
            <div className="px-4 py-3 border-t border-slate-100 text-center text-[0.72rem] text-slate-400">
              Showing 150 of {results.length} — refine your search for more specific results
            </div>
          )}
        </div>
      )}
    </div>
  );
}
