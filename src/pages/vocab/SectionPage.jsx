import { useParams, Link } from 'react-router-dom';
import { D, displayName, getLevel } from '../../data';

export default function SectionPage() {
  const { sectionId } = useParams();
  const section = decodeURIComponent(sectionId);
  const words = D[section] || [];
  const level = getLevel(section);
  const isN5 = level === 'N5';

  if (!D[section]) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-xl">?</div>
        <p className="text-base font-semibold text-slate-700 mb-1">Section not found</p>
        <Link to="/" className="text-sm text-n5 hover:underline mt-1">← Back to index</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl page-enter">
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-slate-500 hover:text-slate-900 transition-colors no-underline"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M10 12L6 8l4-4"/></svg>
          Vocabulary
        </Link>
        <span className="text-slate-300 text-sm">/</span>
        <span className="text-[0.78rem] font-medium text-slate-700">{displayName(section)}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{displayName(section)}</h2>
        <span className={isN5 ? 'badge-n5' : 'badge-n4'}>{level}</span>
        <span className="text-sm text-slate-400">{words.length} words</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse vocab-table">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 w-12">#</th>
              <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Kanji</th>
              <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Reading</th>
              <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Romaji</th>
              <th className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">English</th>
            </tr>
          </thead>
          <tbody>
            {words.map((w, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-[0.72rem] text-slate-400 tabular-nums">{w.num}</td>
                <td className="px-4 py-3 text-lg font-semibold text-slate-900 font-jp min-w-[80px]">{w.kanji}</td>
                <td className="px-4 py-3 text-sm text-n5 font-medium min-w-[100px]">{w.kana}</td>
                <td className="px-4 py-3 text-[0.75rem] text-slate-400 italic hidden sm:table-cell">{w.romaji}</td>
                <td className="px-4 py-3 text-sm text-slate-700 font-medium">{w.english}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
