import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

/* ─────────────────────── helpers ────────────────────────── */
const TABS = ['Vocabulary', 'Kanji', 'Grammar'];

const TABLE_MAP = {
  Vocabulary: 'vocab',
  Kanji:      'kanji',
  Grammar:    'grammar',
};

const COLUMNS = {
  Vocabulary: ['num', 'word', 'kana', 'romaji', 'english', 'category', 'jlpt_level'],
  Kanji:      ['num', 'kanji', 'kana', 'romaji', 'on_reading', 'kun_reading', 'english', 'example', 'ex_reading', 'ex_english', 'stroke_count', 'category', 'jlpt_level'],
  Grammar:    ['level', 'title', 'meaning', 'structure', 'example_jp', 'example_en', 'tags', 'source'],
};

const REQUIRED = {
  Vocabulary: ['word', 'english'],
  Kanji:      ['kanji', 'english'],
  Grammar:    ['title', 'meaning'],
};

const DISPLAY_COLS = {
  Vocabulary: ['num', 'word', 'kana', 'romaji', 'english', 'category', 'jlpt_level'],
  Kanji:      ['num', 'kanji', 'on_reading', 'kun_reading', 'english', 'example', 'stroke_count', 'category', 'jlpt_level'],
  Grammar:    ['level', 'title', 'meaning', 'structure', 'tags', 'source'],
};

const TEXTAREA_COLS = ['meaning', 'structure', 'example_jp', 'example_en', 'tags'];

/* ─────────────────────── blank row ──────────────────────── */
function blankRow(tab) {
  return Object.fromEntries(COLUMNS[tab].map(c => ([c, ''])));
}

/* ─────────────────────── Modal ──────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────── RowForm ─────────────────────────── */
function RowForm({ tab, initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || blankRow(tab));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {COLUMNS[tab].map(col => (
        <div key={col}>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">{col.replace(/_/g, ' ')}</label>
          {TEXTAREA_COLS.includes(col) ? (
            <textarea
              rows={3}
              value={form[col] ?? ''}
              onChange={e => set(col, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 resize-none"
              placeholder={col.replace(/_/g, ' ')}
            />
          ) : (
            <input
              type={col === 'num' ? 'number' : 'text'}
              value={form[col] ?? ''}
              onChange={e => set(col, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder={col.replace(/_/g, ' ')}
              required={REQUIRED[tab]?.includes(col)}
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors border-none cursor-pointer disabled:opacity-60">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors border-none cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────── TabContent ─────────────────────── */
function TabContent({ tab }) {
  const table  = TABLE_MAP[tab];
  const cols   = DISPLAY_COLS[tab];

  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(null); // null | { mode:'add'|'edit', row:obj }
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState(null);
  const [error,   setError]   = useState('');
  const [page,    setPage]    = useState(1);
  const PER_PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const orderCol = tab === 'Grammar' ? 'id' : 'num';
    const { data, error: err } = await supabase
      .from(table)
      .select('*')
      .order(orderCol, { ascending: true });
    if (err) setError(err.message);
    else setRows(data || []);
    setLoading(false);
  }, [table, tab]);

  useEffect(() => { setPage(1); load(); }, [load]);

  /* search filter across visible columns */
  const filtered = rows.filter(r =>
    !search || cols.some(c => String(r[c] || '').toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ── save (add / edit) ── */
  const handleSave = async (form) => {
    setSaving(true); setError('');
    const clean = {};
    Object.entries(form).forEach(([k, v]) => {
      clean[k] = v === '' ? null : v;
    });
    let err;
    if (modal.mode === 'add') {
      ({ error: err } = await supabase.from(table).insert([clean]));
    } else {
      ({ error: err } = await supabase.from(table).update(clean).eq('id', modal.row.id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    setModal(null);
    load();
  };

  /* ── delete ── */
  const handleDelete = async (row) => {
    const label = row.word || row.character || row.title || row.id;
    if (!window.confirm(`Delete "${label}" from ${tab}? This cannot be undone.`)) return;
    setDeleting(row.id);
    const { error: err } = await supabase.from(table).delete().eq('id', row.id);
    if (err) setError(err.message);
    else setRows(prev => prev.filter(r => r.id !== row.id));
    setDeleting(null);
  };

  const cellVal = (row, col) => {
    const v = row[col];
    if (v == null || v === '') return <span className="text-slate-300">—</span>;
    const str = String(v);
    return str.length > 40 ? str.slice(0, 40) + '…' : str;
  };

  return (
    <div>
      {/* toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={`Search ${tab.toLowerCase()}…`}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-400"/>
        </div>
        <span className="text-xs text-slate-400 font-medium">{filtered.length} rows</span>
        <button onClick={() => setModal({ mode: 'add', row: null })}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors border-none cursor-pointer">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/></svg>
          Add Row
        </button>
        <button onClick={load}
          className="flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors border-none cursor-pointer">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.389zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd"/></svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
      )}

      {/* table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {cols.map(c => (
                    <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                      {c.replace(/_/g, ' ')}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr><td colSpan={cols.length + 1} className="px-5 py-10 text-center text-slate-400">No records found</td></tr>
                )}
                {paginated.map(row => (
                  <tr key={row.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                    {cols.map(c => (
                      <td key={c} className="px-4 py-3 text-slate-700 text-xs max-w-[160px] truncate">
                        {cellVal(row, c)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setModal({ mode: 'edit', row })}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border-none cursor-pointer">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M13.488 2.513a1.75 1.75 0 00-2.475 0L6.75 6.774a2.75 2.75 0 00-.596.892l-.583 1.457a.75.75 0 00.98.98l1.457-.583a2.75 2.75 0 00.892-.596l4.262-4.263a1.75 1.75 0 000-2.475l-.674-.673zM3.75 12.5h3a.75.75 0 010 1.5h-3a2.25 2.25 0 01-2.25-2.25v-8.5A2.25 2.25 0 013.75 1h3a.75.75 0 010 1.5h-3a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75z"/></svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          disabled={deleting === row.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border-none cursor-pointer disabled:opacity-50">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0 001.493-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.075l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75 0 01-1.498-.075l.275-5.5a.75.75 0 01.786-.712z" clipRule="evenodd"/></svg>
                          {deleting === row.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 border-solid cursor-pointer">
              ← Prev
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 border-solid cursor-pointer">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <Modal
          title={modal.mode === 'add' ? `Add ${tab} Row` : `Edit ${tab} Row`}
          onClose={() => setModal(null)}
        >
          <RowForm
            tab={tab}
            initial={modal.row ? { ...modal.row } : null}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            saving={saving}
          />
          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────── ContentPage ────────────────────── */
export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('Vocabulary');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Content Manager</h2>
        <p className="text-sm text-slate-500 mt-0.5">Add, edit, or remove records in the database</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all border-none cursor-pointer ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 bg-transparent'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <TabContent key={activeTab} tab={activeTab} />
    </div>
  );
}
