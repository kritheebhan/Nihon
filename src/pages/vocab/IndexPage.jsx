import { Link } from 'react-router-dom';
import { useData, displayName } from '../../context/DataContext';

export default function IndexPage() {
  const { D = {}, n5VocabSecs = [], n4VocabSecs = [] } = useData() || {};

  const n5Total = n5VocabSecs.reduce((s, k) => s + ((D[k] || []).length || 0), 0);
  const n4Total = n4VocabSecs.reduce((s, k) => s + ((D[k] || []).length || 0), 0);
  const vocabTotal = n5Total + n4Total;

  if (!D || Object.keys(D).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto page-enter">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Vocabulary</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {vocabTotal.toLocaleString()} words across N5 and N4
        </p>
      </div>

      {/* ── Vocab count strip ── */}
      <div className="flex gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center gap-3 shadow-sm">
          <span className="w-6 h-6 rounded bg-n5 flex items-center justify-center text-[0.5rem] font-black text-white">N5</span>
          <div>
            <div className="text-xl font-black text-slate-900">{n5Total}</div>
            <div className="text-xs text-slate-500 font-medium">N5 Words</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center gap-3 shadow-sm">
          <span className="w-6 h-6 rounded bg-n4 flex items-center justify-center text-[0.5rem] font-black text-white">N4</span>
          <div>
            <div className="text-xl font-black text-slate-900">{n4Total}</div>
            <div className="text-xs text-slate-500 font-medium">N4 Words</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center gap-3 shadow-sm ml-auto">
          <div className="text-xl font-black text-slate-900">{vocabTotal}</div>
          <div className="text-xs text-slate-500 font-medium">Total Words</div>
        </div>
      </div>

      {/* ── Vocabulary Sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* N5 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
            <span className="w-5 h-5 rounded bg-n5 flex items-center justify-center text-[0.55rem] font-black text-white">N5</span>
            <span className="text-sm font-semibold text-slate-700">N5 Vocabulary</span>
            <span className="ml-auto text-[0.68rem] font-medium text-slate-400">{n5Total} words</span>
          </div>
          {n5VocabSecs.map(s => (
            <Link
              key={s}
              to={`/app/section/${encodeURIComponent(s)}`}
              className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 last:border-0 no-underline group transition-colors hover:bg-blue-50/60"
            >
              <span className="text-[0.82rem] text-slate-700 group-hover:text-n5 transition-colors font-medium">{displayName(s)}</span>
              <span className="text-[0.65rem] text-slate-400 group-hover:text-n5 bg-slate-50 group-hover:bg-blue-100 px-2 py-0.5 rounded-md font-semibold transition-colors tabular-nums">
                {D[s]?.length ?? 0}
              </span>
            </Link>
          ))}
        </div>

        {/* N4 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
            <span className="w-5 h-5 rounded bg-n4 flex items-center justify-center text-[0.55rem] font-black text-white">N4</span>
            <span className="text-sm font-semibold text-slate-700">N4 Vocabulary</span>
            <span className="ml-auto text-[0.68rem] font-medium text-slate-400">{n4Total} words</span>
          </div>
          {n4VocabSecs.map(s => (
            <Link
              key={s}
              to={`/app/section/${encodeURIComponent(s)}`}
              className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 last:border-0 no-underline group transition-colors hover:bg-purple-50/60"
            >
              <span className="text-[0.82rem] text-slate-700 group-hover:text-n4 transition-colors font-medium">{displayName(s)}</span>
              <span className="text-[0.65rem] text-slate-400 group-hover:text-n4 bg-slate-50 group-hover:bg-purple-100 px-2 py-0.5 rounded-md font-semibold transition-colors tabular-nums">
                {D[s]?.length ?? 0}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
